package com.example.family.service;

import com.example.family.model.AuditLog;
import com.example.family.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AsyncAuditService {

    private static final Logger log = LoggerFactory.getLogger(AsyncAuditService.class);
    
    private final AuditLogRepository auditLogRepository;

    public AsyncAuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Asynchronous method. When invoked, Spring intercepts the call and forwards the execution
     * to a thread from the 'auditTaskExecutor' thread pool instead of the main HTTP execution thread.
     *
     * @param action  The action type being performed (e.g., "RESOLVE_RELATION", "GOOGLE_AUTH")
     * @param details Additional context payload for the log.
     */
    @Async("auditTaskExecutor")
    public void logActivityAsync(String action, String details) {
        String threadName = Thread.currentThread().getName();
        log.info("[ASYNC THREAD START] Logging action: '{}' | Thread: {}", action, threadName);

        try {
            // Simulated Latency: Imagine we are calling a third-party geolocation service,
            // preparing analytics, or running a complex audit process.
            // With this 1.5 seconds delay, if this were synchronous, the user would feel 
            // the app is slow. But asynchronously, the HTTP response returns immediately, 
            // and this thread works in the background!
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            log.error("Background async thread execution was interrupted", e);
            Thread.currentThread().interrupt();
        }

        // Save our audit record to PostgreSQL
        AuditLog audit = new AuditLog(action, details, threadName, LocalDateTime.now());
        auditLogRepository.save(audit);

        log.info("[ASYNC THREAD COMPLETE] Activity saved to PostgreSQL | Thread: {}", threadName);
    }
}
