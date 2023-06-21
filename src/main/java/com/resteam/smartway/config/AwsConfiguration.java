package com.resteam.smartway.config;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.SDKGlobalConfiguration;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.util.AwsHostNameUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class AwsConfiguration {

    private final AwsProperties awsProperties;

    @Bean
    public AmazonS3Client getAmazonS3Client() {
        System.setProperty(SDKGlobalConfiguration.ENABLE_S3_SIGV4_SYSTEM_PROPERTY, "true");

        var configuration = new ClientConfiguration();
        var proxy = awsProperties.getProxy();
        if (proxy != null && StringUtils.isNotEmpty(proxy.getHost())) {
            configuration.setProxyHost(proxy.getHost());
            if (proxy.getPort() != null) {
                configuration.setProxyPort(proxy.getPort());
            }
            if (proxy.getProtocol() != null) {
                configuration.setProxyProtocol(proxy.getProtocol());
            }
            configuration.setProxyUsername(proxy.getUsername());
            configuration.setProxyPassword(proxy.getPassword());
        }

        var credentials = new BasicAWSCredentials(
            awsProperties.getCredentials().getAccessKey(),
            awsProperties.getCredentials().getSecretKey()
        );
        var builder = AmazonS3ClientBuilder
            .standard()
            .withClientConfiguration(configuration)
            .withCredentials(new AWSStaticCredentialsProvider(credentials));

        var endpoint = awsProperties.getEndPoint();
        if (StringUtils.isNotEmpty(endpoint)) {
            builder =
                builder
                    .withEndpointConfiguration(
                        new AwsClientBuilder.EndpointConfiguration(
                            endpoint,
                            AwsHostNameUtils.parseRegion(endpoint, AmazonS3Client.S3_SERVICE_NAME)
                        )
                    )
                    .withPathStyleAccessEnabled(true);
        } else if (StringUtils.isNotEmpty(awsProperties.getRegion())) {
            builder = builder.withRegion(awsProperties.getRegion());
        }

        return (AmazonS3Client) builder.build();
    }
}
