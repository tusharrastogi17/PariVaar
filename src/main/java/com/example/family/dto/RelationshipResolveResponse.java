package com.example.family.dto;

import java.util.List;

public class RelationshipResolveResponse {
    private Long sourceId;
    private Long targetId;
    private String relationship;
    private List<String> path;
    private int distance;

    public RelationshipResolveResponse() {
    }

    public RelationshipResolveResponse(Long sourceId, Long targetId, String relationship, List<String> path, int distance) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.relationship = relationship;
        this.path = path;
        this.distance = distance;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public List<String> getPath() {
        return path;
    }

    public void setPath(List<String> path) {
        this.path = path;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }
}

