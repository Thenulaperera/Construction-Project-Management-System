package com.worksitex.service;

import com.worksitex.model.Project;
import com.worksitex.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setLocation(projectDetails.getLocation());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setBudget(projectDetails.getBudget());
        project.setProgress(projectDetails.getProgress());
        project.setStatus(projectDetails.getStatus());
        project.setManager(projectDetails.getManager());
        project.setWorkerCount(projectDetails.getWorkerCount());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        projectRepository.delete(project);
    }
    
    public List<Project> getProjectsByStatus(String status) {
        return projectRepository.findByStatus(status);
    }
    
    public List<Project> searchProjects(String keyword) {
        return projectRepository.findByNameOrDescriptionContaining(keyword);
    }
    
    public Long getActiveProjectsCount() {
        return projectRepository.countActiveProjects();
    }
}
