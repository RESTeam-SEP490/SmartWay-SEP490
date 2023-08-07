package com.resteam.smartway.service.aws;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.google.common.io.ByteSource;
import com.resteam.smartway.config.AwsProperties;
import java.io.IOException;
import java.util.Date;
import java.util.Set;
import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3Client s3Client;
    private final AwsProperties awsProperties;
    public static final String BASE_PATH = "/api/files/o/";

    @PostConstruct
    public void initialize() {
        var bucketName = awsProperties.getS3().getBucketName();
        if (!s3Client.doesBucketExist(bucketName)) {
            s3Client.createBucket(bucketName);
        }
    }

    public void uploadImage(MultipartFile multipartFile, String path) throws IOException {
        var bucketName = awsProperties.getS3().getBucketName();

        ObjectMetadata data = new ObjectMetadata();
        data.setContentType(multipartFile.getContentType());
        data.setContentLength(multipartFile.getSize());

        PutObjectRequest request = new PutObjectRequest(bucketName, path, multipartFile.getInputStream(), data);
        s3Client.putObject(request);
    }

    //    public String uploadFileToS3(InputStream inputStream, String meetingId, String domain) {
    //        UUID uuid = UUID.randomUUID();
    //        String filePath = new LocalDate() + "/" + meetingId + "/" + uuid.toString();
    //        var bucketName = awsProperties.getS3().getBucketName();
    //        File file = null;
    //        try {
    //            file = File.createTempFile("qrCode", null);
    //        } catch (IOException e) {
    //            e.printStackTrace();
    //        }
    //        try {
    //            Files.copy(inputStream, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
    //        } catch (IOException e) {
    //            e.printStackTrace();
    //        }
    //        PutObjectRequest request = new PutObjectRequest(bucketName, filePath, file);
    //        s3Client.putObject(request);
    //        file.delete();
    //        //todo: need update
    //        return "" + BASE_PATH + filePath;
    //    }

    public String getDownloadUrl(String filePath) {
        var bucketName = awsProperties.getS3().getBucketName();
        var presignedUrlPostDurationInSeconds = awsProperties.getS3().getPresignedUrl().getGet();
        var expiration = new Date(new Date().getTime() + presignedUrlPostDurationInSeconds * 1000);
        var generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, filePath)
            .withMethod(HttpMethod.GET)
            .withExpiration(expiration);
        var url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);

        return url.toString();
    }

    @Async
    public void deleteFile(String filePath) {
        String bucketName = awsProperties.getS3().getBucketName();
        DeleteObjectRequest deleteRequest = new DeleteObjectRequest(bucketName, filePath);
        s3Client.deleteObject(deleteRequest);
    }

    @Async
    public void deleteFiles(Set<String> filePaths) {
        if (CollectionUtils.isEmpty(filePaths)) {
            return;
        }
        String bucketName = awsProperties.getS3().getBucketName();
        DeleteObjectsRequest deleteRequest = new DeleteObjectsRequest(bucketName).withKeys(filePaths.toArray(new String[0]));
        s3Client.deleteObjects(deleteRequest);
    }

    public ByteSource getResource(String filePath) {
        return getResource(awsProperties.getS3().getBucketName(), filePath);
    }

    public ByteSource getResource(String bucketName, String filePath) {
        try (var content = getS3Object(bucketName, filePath).getObjectContent()) {
            return ByteSource.wrap(content.readAllBytes());
        } catch (Exception e) {
            return ByteSource.empty();
        }
    }

    public S3Object getS3Object(String bucketName, String filePath) {
        return s3Client.getObject(new GetObjectRequest(bucketName, filePath));
    }

    public ResponseEntity<Resource> getFile(HttpServletRequest req) throws IOException {
        var filePath = req.getRequestURI().substring(BASE_PATH.length());
        //        var mimeType = req.getServletContext().getMimeType(filePath);
        //        if (mimeType == null || isEmpty(filePath)) {
        //            return ResponseEntity.notFound().build();
        //        }

        var source = this.getResource(filePath);

        if (source.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.inline().build());
        //        var fileName = getBaseName(filePath) + "." + getExtension(filePath);
        //        headers.setContentDisposition(ContentDisposition.attachment().filename(fileName).build());

        return ResponseEntity
            .ok()
            .contentType(MediaType.parseMediaType("image/jpeg"))
            .headers(headers)
            .body(new ByteArrayResource(source.read()));
    }
}
