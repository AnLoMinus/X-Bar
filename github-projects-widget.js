(function () {
  // Add CSS
  const style = document.createElement("style");
  style.textContent = `
    .widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .toggle-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #24292e;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }

    .toggle-btn:hover {
      transform: scale(1.1);
    }

    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1001;
    }

    .show-modal {
      display: block;
    }

    .modal {
      position: relative;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      margin: 20px auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
    }

    .modal-header {
      padding: 20px;
      background: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      color: #24292e;
    }

    .close-modal {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #586069;
    }

    .modal-scroll-container {
      max-height: calc(90vh - 70px);
      overflow-y: auto;
    }

    .profile-section {
      padding: 20px;
      border-bottom: 1px solid #e1e4e8;
    }

    .filters-section {
      padding: 15px 20px;
      background: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
    }

    .search-box {
      position: relative;
      margin-bottom: 10px;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6a737d;
    }

    #search-projects {
      width: 100%;
      padding: 8px 30px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      font-size: 14px;
    }

    .filter-buttons {
      display: flex;
      gap: 10px;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
    }

    .filter-btn.active {
      background: #f1f8ff;
      border-color: #0366d6;
      color: #0366d6;
    }

    .modal-content {
      padding: 20px;
    }

    .project-item {
      padding: 15px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    .project-title {
      color: #0366d6;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }

    .project-description {
      margin: 8px 0;
      color: #586069;
      font-size: 14px;
    }

    .project-stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: #586069;
    }

    .project-language {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .project-stars {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    @media (max-width: 600px) {
      .modal {
        width: 95%;
        margin: 10px auto;
      }
    }
  `;
  document.head.appendChild(style);

  // Add HTML
  const widgetHTML = `
    <div id="github-projects-widget" class="widget-container">
      <button id="toggle-projects" class="toggle-btn">
        <svg class="github-icon" viewBox="0 0 16 16" width="24" height="24">
          <path fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </button>
    </div>
    <div id="projects-modal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">My GitHub Projects</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-scroll-container">
          <div class="filters-section">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>
              </svg>
              <input type="text" placeholder="Search projects..." id="search-projects">
            </div>
            <div class="filter-buttons">
              <button class="filter-btn" data-sort="name">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H2.75ZM7.25 8a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L5.44 8 3.72 6.28a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5Z"></path>
                </svg>
                Sort by name
              </button>
              <button class="filter-btn" data-sort="stars">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                </svg>
                Sort by stars
              </button>
            </div>
          </div>
          <div class="modal-content" id="projects-list"></div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  // Initialize the widget
  class GitHubProjectsWidget {
    constructor() {
      this.toggleBtn = document.getElementById("toggle-projects");
      this.modal = document.getElementById("projects-modal");
      this.closeBtn = document.querySelector(".close-modal");
      this.projectsList = document.getElementById("projects-list");
      this.searchInput = document.getElementById("search-projects");
      this.allProjects = [];
      this.currentSort = { field: "name", direction: "asc" };
      this.filterButtons = document.querySelectorAll(".filter-btn");

      this.init();
    }

    init() {
      this.toggleBtn.addEventListener("click", () => this.toggleModal());
      this.closeBtn.addEventListener("click", () => this.closeModal());
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.closeModal();
      });

      this.searchInput?.addEventListener("input", (e) =>
        this.handleSearch(e.target.value)
      );

      this.filterButtons.forEach((button) => {
        button.addEventListener("click", () =>
          this.handleSort(button.dataset.sort)
        );
      });

      this.loadProjects();
    }

    handleSort(field) {
      // Toggle sort direction if clicking the same field
      if (this.currentSort.field === field) {
        this.currentSort.direction =
          this.currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        this.currentSort.field = field;
        this.currentSort.direction = "asc";
      }

      // Update active button state
      this.filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.sort === field);
      });

      // Sort and update UI
      this.sortProjects();
    }

    sortProjects() {
      const sortedProjects = [...this.allProjects].sort((a, b) => {
        let compareValue;

        if (this.currentSort.field === "name") {
          compareValue = a.name.localeCompare(b.name);
        } else if (this.currentSort.field === "stars") {
          compareValue = b.stargazers_count - a.stargazers_count;
        }

        return this.currentSort.direction === "asc"
          ? compareValue
          : -compareValue;
      });

      this.updateProjectsUI(sortedProjects);
    }

    handleSearch(searchTerm) {
      const filteredProjects = this.allProjects.filter((project) => {
        const searchString = `${project.name} ${
          project.description || ""
        }`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      });

      // Apply current sorting to search results
      const sortedAndFiltered = [...filteredProjects].sort((a, b) => {
        let compareValue;

        if (this.currentSort.field === "name") {
          compareValue = a.name.localeCompare(b.name);
        } else if (this.currentSort.field === "stars") {
          compareValue = b.stargazers_count - a.stargazers_count;
        }

        return this.currentSort.direction === "asc"
          ? compareValue
          : -compareValue;
      });

      this.updateProjectsUI(sortedAndFiltered);
    }

    toggleModal() {
      this.modal.classList.add("show-modal");
      document.body.style.overflow = "hidden";
    }

    closeModal() {
      this.modal.classList.remove("show-modal");
      document.body.style.overflow = "";
    }

    async loadProjects() {
      try {
        // First try to load from local projects.json
        const response = await fetch("projects.json");
        if (response.ok) {
          const data = await response.json();
          this.allProjects = data.projects;
        } else {
          // Fallback to GitHub API if local file not found
          const apiResponse = await fetch(
            "https://api.github.com/users/AnLoMinus/repos"
          );
          if (!apiResponse.ok) throw new Error("Failed to fetch projects");
          this.allProjects = await apiResponse.json();
        }
        this.sortProjects(); // Apply default sorting
      } catch (error) {
        console.error("Error loading projects:", error);
        this.projectsList.innerHTML = `
          <div class="error-message">
            Failed to load projects. Please try again later.
          </div>
        `;
      }
    }

    updateProjectsUI(projects) {
      this.projectsList.innerHTML = projects
        .map(
          (project) => `
            <div class="project-item">
              <a href="${
                project.html_url
              }" class="project-title" target="_blank">
                ${project.name}
              </a>
              <p class="project-description">
                ${project.description || "No description available"}
              </p>
              <div class="project-stats">
                ${
                  project.language
                    ? `
                    <div class="project-language">
                      ${project.language}
                    </div>
                  `
                    : ""
                }
                <div class="project-stars">
                  ⭐ ${project.stargazers_count}
                </div>
                ${
                  project.topics?.length
                    ? `
                    <div class="project-topics">
                      ${project.topics
                        .map((topic) => `<span class="topic">${topic}</span>`)
                        .join("")}
                    </div>
                  `
                    : ""
                }
              </div>
            </div>
          `
        )
        .join("");
    }
  }

  // Initialize the widget when the DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new GitHubProjectsWidget();
    });
  } else {
    new GitHubProjectsWidget();
  }
})();
