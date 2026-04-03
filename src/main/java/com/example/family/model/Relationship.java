package com.example.family.model;

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

    private Long sourcePersonId;

    private Long targetPersonId;

    @Enumerated(EnumType.STRING)
    private RelationType relation;

    public Relationship() {
    }

    public Relationship(Long sourcePersonId, Long targetPersonId, RelationType relation) {
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

    public Long getSourcePersonId() {
        return sourcePersonId;
    }

    public void setSourcePersonId(Long sourcePersonId) {
        this.sourcePersonId = sourcePersonId;
    }

    public Long getTargetPersonId() {
        return targetPersonId;
    }

    public void setTargetPersonId(Long targetPersonId) {
        this.targetPersonId = targetPersonId;
    }

    public RelationType getRelation() {
        return relation;
    }

    public void setRelation(RelationType relation) {
        this.relation = relation;
    }
}

