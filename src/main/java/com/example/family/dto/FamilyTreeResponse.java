package com.example.family.dto;

import java.util.ArrayList;
import java.util.List;

public class FamilyTreeResponse {

    private String id;
    private String name;
    private String gender;
    private String spouse;
    private String spouseId;
    private String spouseGender;
    private List<FamilyTreeResponse> children = new ArrayList<>();

    public FamilyTreeResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSpouseId() {
        return spouseId;
    }

    public void setSpouseId(String spouseId) {
        this.spouseId = spouseId;
    }

    public String getSpouseGender() {
        return spouseGender;
    }

    public void setSpouseGender(String spouseGender) {
        this.spouseGender = spouseGender;
    }
}
