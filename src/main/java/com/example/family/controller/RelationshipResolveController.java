package com.example.family.controller;

import com.example.family.dto.RelationshipResolveResponse;
import com.example.family.service.AsyncAuditService;
import com.example.family.service.RelationshipResolverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class RelationshipResolveController {

    private static final Logger log = LoggerFactory.getLogger(RelationshipResolveController.class);

    private final RelationshipResolverService resolverService;
    private final AsyncAuditService asyncAuditService;

    public RelationshipResolveController(RelationshipResolverService resolverService, AsyncAuditService asyncAuditService) {
        this.resolverService = resolverService;
        this.asyncAuditService = asyncAuditService;
    }

    @GetMapping("/relationships/resolve")
    public RelationshipResolveResponse resolve(
            @RequestParam Long sourceId,
            @RequestParam Long targetId) {
        String mainThread = Thread.currentThread().getName();
        log.info("[HTTP THREAD] Received Relationship Resolve Request (Source: {}, Target: {}) | Thread: {}", 
                sourceId, targetId, mainThread);

        RelationshipResolveResponse response = resolverService.resolve(sourceId, targetId);

        // ASYNC TRIGGER: Hand off logging to our custom ThreadPoolTaskExecutor
        asyncAuditService.logActivityAsync("RESOLVE_RELATION", 
                "Source: " + sourceId + ", Target: " + targetId + " | Resolved to: " + response.getRelationship());

        log.info("[HTTP THREAD] Returning Resolve Response | Thread: {}", mainThread);
        return response;
    }
}
