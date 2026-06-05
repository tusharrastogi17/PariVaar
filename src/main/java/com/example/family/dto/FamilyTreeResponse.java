package com.example.family.dto;

import java.util.ArrayList;
import java.util.List;

public class FamilyTreeResponse {

    private Long id;
    private String name;
    private String spouse;
    private List<FamilyTreeResponse> children = new ArrayList<>();

    public FamilyTreeResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpouse() {
        return spouse;
    }

    public void setSpouse(String spouse) {
        this.spouse = spouse;
    }

    public List<FamilyTreeResponse> getChildren() {
        return children;
    }

    public void setChildren(List<FamilyTreeResponse> children) {
        this.children = children;
    }
}
