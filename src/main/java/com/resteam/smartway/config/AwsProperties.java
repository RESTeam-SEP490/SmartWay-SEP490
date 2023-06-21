package com.resteam.smartway.config;

import com.amazonaws.Protocol;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "aws", ignoreUnknownFields = false)
public class AwsProperties {

    private String endPoint;
    private String region;
    private Credentials credentials;
    private Proxy proxy;
    private S3 s3;

    @Data
    public static class S3 {

        private String bucketName;
        private PresignedUrl presignedUrl = new PresignedUrl();

        @Data
        public static class PresignedUrl {

            private Integer get = 60 * 60;
            private Integer post = 60 * 2;
        }
    }

    @Data
    public static class Credentials {

        private String accessKey;
        private String secretKey;
    }

    @Data
    public static class Proxy {

        private String host;
        private Integer port;
        private String username;
        private String password;
        private Protocol protocol;
    }
}
