package com.worksitex.controller;

import com.worksitex.model.Document;
import com.worksitex.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Document> createDocument(@Valid @RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        String type = (String) payload.get("type");
        String filePath = (String) payload.get("filePath");
        Long projectId = payload.get("projectId") != null ? Long.valueOf(payload.get("projectId").toString()) : null;

        Document document = documentService.createDocument(name, type, filePath, projectId);
        return ResponseEntity.ok(document);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @Valid @RequestBody Document documentDetails) {
        try {
            Document updatedDocument = documentService.updateDocument(id, documentDetails);
            return ResponseEntity.ok(updatedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{projectId}")
    public List<Document> getDocumentsByProject(@PathVariable Long projectId) {
        return documentService.getDocumentsByProject(projectId);
    }

    @GetMapping("/search")
    public List<Document> searchDocuments(@RequestParam String keyword) {
        return documentService.searchDocuments(keyword);
    }
}
