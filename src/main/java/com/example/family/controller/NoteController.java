package com.example.family.controller;

import com.example.family.model.NoteDocument;
import com.example.family.repository.NoteDocumentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteDocumentRepository noteDocumentRepository;

    public NoteController(NoteDocumentRepository noteDocumentRepository) {
        this.noteDocumentRepository = noteDocumentRepository;
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello260518";
    }

    @GetMapping
    public List<NoteDocument> fetchNotes() {
        return noteDocumentRepository.findByUserId(getAuthenticatedUserId());
    }

    @PostMapping
    public NoteDocument createNote(@RequestBody NoteDocument noteDocument) {
        noteDocument.setUserId(getAuthenticatedUserId());
        return noteDocumentRepository.save(noteDocument);
    }

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user in security context");
        }
        return authentication.getPrincipal().toString();
    }
}
