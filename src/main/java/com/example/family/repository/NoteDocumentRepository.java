package com.example.family.repository;

import com.example.family.model.NoteDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteDocumentRepository extends JpaRepository<NoteDocument, Long> {
    List<NoteDocument> findByUserId(String userId);
}
