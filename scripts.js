class GitHubProjectsWidget {
  constructor() {
    this.toggleBtn = document.getElementById("toggle-projects");
    this.modal = document.getElementById("projects-modal");
    this.closeBtn = document.querySelector(".close-modal");
    this.projectsList = document.getElementById("projects-list");
    this.searchInput = document.getElementById("search-projects");
    this.allProjects = []; // Store all projects for filtering
    this.currentSort = { field: "name", direction: "asc" };
    this.filterButtons = document.querySelectorAll(".filter-btn");

    this.init();
  }

  init() {
    // Add event listeners
    this.toggleBtn.addEventListener("click", () => this.toggleModal());
    this.closeBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Add search functionality
    this.searchInput?.addEventListener("input", (e) =>
      this.handleSearch(e.target.value)
    );

    // Load profile and projects when widget is initialized
    this.loadProfile();
    this.loadProjects();

    // Add sorting functionality
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.handleSort(button.dataset.sort)
      );
    });
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

  async loadProfile() {
    try {
      const response = await fetch("https://api.github.com/users/AnLoMinus");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const profile = await response.json();
      this.updateProfileUI(profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  async loadProjects() {
    try {
      const response = await fetch(
        "https://api.github.com/users/AnLoMinus/repos"
      );
      if (!response.ok) throw new Error("Failed to fetch projects");
      this.allProjects = await response.json(); // Store all projects
      this.sortProjects(); // Apply default sorting
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }

  updateProfileUI(profile) {
    // Profile UI is now static in HTML
    // You can update dynamic elements here if needed
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
                    </div>
                </div>
            `
      )
      .join("");
  }
}

// Initialize the widget when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GitHubProjectsWidget();
});
