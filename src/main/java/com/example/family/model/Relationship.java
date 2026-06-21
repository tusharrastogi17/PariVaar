package com.example.family.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "relationships")
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sourcePersonId;

    private String targetPersonId;

    @Enumerated(EnumType.STRING)
    private RelationType relation;

    // Stores the Google email of the user who owns this relationship
    @Column(name = "user_id", nullable = false)
    private String userId;

    public Relationship() {
    }

    public Relationship(String sourcePersonId, String targetPersonId, RelationType relation) {
        this.sourcePersonId = sourcePersonId;
        this.targetPersonId = targetPersonId;
        this.relation = relation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSourcePersonId() {
        return sourcePersonId;
    }

    public void setSourcePersonId(String sourcePersonId) {
        this.sourcePersonId = sourcePersonId;
    }

    public String getTargetPersonId() {
        return targetPersonId;
    }

    public void setTargetPersonId(String targetPersonId) {
        this.targetPersonId = targetPersonId;
    }

    public RelationType getRelation() {
        return relation;
    }

    public void setRelation(RelationType relation) {
        this.relation = relation;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

