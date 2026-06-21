package com.worksitex.service;

import com.worksitex.model.Document;
import com.worksitex.model.Project;
import com.worksitex.repository.DocumentRepository;
import com.worksitex.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public Document createDocument(String name, String type, String filePath, Long projectId) {
        Document document = new Document();
        document.setName(name);
        document.setType(type);
        document.setFilePath(filePath);

        if (projectId != null) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
            document.setProject(project);
        }

        return documentRepository.save(document);
    }

    public Document updateDocument(Long id, Document documentDetails) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        document.setName(documentDetails.getName());
        document.setType(documentDetails.getType());
        document.setFilePath(documentDetails.getFilePath());
        document.setProject(documentDetails.getProject());

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        documentRepository.delete(document);
    }

    public List<Document> getDocumentsByProject(Long projectId) {
        return documentRepository.findByProjectId(projectId);
    }

    public List<Document> searchDocuments(String keyword) {
        return documentRepository.findByNameContaining(keyword);
    }
}
