package com.example.family.controller;

import com.example.family.dto.RelationshipResolveResponse;
import com.example.family.service.RelationshipResolverService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RelationshipResolveController {

    private final RelationshipResolverService resolverService;

    public RelationshipResolveController(RelationshipResolverService resolverService) {
        this.resolverService = resolverService;
    }

    @GetMapping("/relationships/resolve")
    public RelationshipResolveResponse resolve(
            @RequestParam Long sourceId,
            @RequestParam Long targetId
    ) {
        return resolverService.resolve(sourceId, targetId);
    }
}

