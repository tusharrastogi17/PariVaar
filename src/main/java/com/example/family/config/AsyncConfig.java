package com.example.family.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync // Enabler: Instructs Spring to look for @Async and run those methods in a background pool
public class AsyncConfig {

    @Bean(name = "auditTaskExecutor")
    public Executor auditTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // 1. Core Pool Size: Threads that are kept alive even if they are idle.
        // Sized based on the expected concurrent traffic (I/O-heavy database operations).
        executor.setCorePoolSize(3);
        
        // 2. Max Pool Size: The maximum limit of threads that can be spawned under peak load.
        executor.setMaxPoolSize(10);
        
        // 3. Queue Capacity: The blocking queue that holds tasks waiting to be processed.
        // If this queue fills up, only then will the pool scale up from core size to max size.
        executor.setQueueCapacity(100);
        
        // 4. Thread Name Prefix: Essential for debugging production log files and thread dumps.
        executor.setThreadNamePrefix("parivaar-audit-");
        
        // 5. Rejected Execution Policy: Backpressure mechanism.
        // If the queue is full and all 10 threads are busy, CallerRunsPolicy forces the calling 
        // HTTP thread to execute it synchronously. This slows down incoming requests gracefully 
        // instead of crashing or losing the logs under heavy spikes.
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        // 6. Graceful Shutdown: Ensures active tasks are completed when Spring Boot shuts down.
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        
        executor.initialize();
        return executor;
    }
}
