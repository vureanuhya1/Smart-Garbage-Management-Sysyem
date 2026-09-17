
document.addEventListener("DOMContentLoaded", function () {

    // Display today's date
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        const today = new Date();

        todayDate.textContent = today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    loadWorkerDashboard();

    // Refresh dashboard data periodically.
    setInterval(loadWorkerDashboard, 30000);
});
document.addEventListener("DOMContentLoaded", function () {
    loadWorkerDashboard();

    // Refresh dashboard data periodically.
    setInterval(loadWorkerDashboard, 30000);
});


async function loadWorkerDashboard() {
    try {
        const response = await fetch("/api/worker/dashboard", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "same-origin"
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/worker-login";
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Dashboard request failed: " + response.status
            );
        }

        const data = await response.json();

        updateDashboardStatistics(data);
        updateRecentComplaints(data);
        updateWorkerInformation(data);

    } catch (error) {
        console.error("Worker dashboard error:", error);

        showDashboardError(
            "Unable to load the latest dashboard data."
        );
    }
}


/*
 * Update dashboard statistic cards.
 */
function updateDashboardStatistics(data) {
    const totalAssigned =
        getValue(
            data,
            [
                "total_assigned",
                "assigned",
                "total"
            ],
            0
        );

    const pending =
        getValue(
            data,
            [
                "pending",
                "pending_count"
            ],
            0
        );

    const inProgress =
        getValue(
            data,
            [
                "in_progress",
                "in_progress_count"
            ],
            0
        );

    const resolved =
        getValue(
            data,
            [
                "resolved",
                "resolved_count",
                "completed",
                "completed_count"
            ],
            0
        );

    const efficiency =
        getValue(
            data,
            [
                "efficiency",
                "efficiency_percentage"
            ],
            0
        );

    updateElement(
        [
            "totalAssigned",
            "assignedCount",
            "total-assigned"
        ],
        totalAssigned
    );

    updateElement(
        [
            "pendingCount",
            "pending",
            "pending-complaints"
        ],
        pending
    );

    updateElement(
        [
            "inProgressCount",
            "in-progress-count",
            "inProgress"
        ],
        inProgress
    );

    updateElement(
        [
            "resolvedCount",
            "resolved",
            "resolved-complaints",
            "completedCount"
        ],
        resolved
    );

    updateElement(
        [
            "efficiency",
            "efficiencyValue",
            "efficiencyPercentage"
        ],
        formatPercentage(efficiency)
    );
}


/*
 * Update recent complaint information if
 * the dashboard API provides it.
 */
function updateRecentComplaints(data) {
    let complaints =
        data.complaints ||
        data.recent_complaints ||
        data.recent ||
        [];

    if (!Array.isArray(complaints)) {
        return;
    }

    const container =
        document.getElementById("recentComplaints") ||
        document.getElementById("recent-complaints") ||
        document.querySelector(".recent-complaints-list");

    if (!container) {
        return;
    }

    if (complaints.length === 0) {
        container.innerHTML =
            '<p class="empty-state">No complaints found.</p>';
        return;
    }

    container.innerHTML = "";

    complaints.forEach(function (complaint) {
        const item = document.createElement("div");

        item.className = "recent-complaint-item";

        const complaintId =
            complaint.complaint_display_id ||
            complaint.display_id ||
            complaint.complaint_id ||
            "N/A";

        const issueType =
            complaint.issue_type ||
            complaint.category ||
            "Garbage complaint";

        const status =
            complaint.status ||
            "Assigned";

        item.innerHTML = `
            <div class="complaint-info">
                <strong>${escapeHtml(String(complaintId))}</strong>
                <span>${escapeHtml(String(issueType))}</span>
            </div>

            <span class="status-badge status-${getStatusClass(status)}">
                ${escapeHtml(String(status))}
            </span>
        `;

        container.appendChild(item);
    });
}


/*
 * Update worker information.
 */
function updateWorkerInformation(data) {
    const worker =
        data.worker ||
        data.profile ||
        {};

    if (worker.name) {
        updateElement(
            [
                "workerName",
                "worker-name",
                "profileWorkerName"
            ],
            worker.name
        );
    }

    if (worker.worker_id) {
        updateElement(
            [
                "workerId",
                "worker-id",
                "profileWorkerId"
            ],
            worker.worker_id
        );
    }

    if (worker.email) {
        updateElement(
            [
                "workerEmail",
                "worker-email"
            ],
            worker.email
        );
    }
}


/*
 * Generic value finder.
 */
function getValue(object, keys, defaultValue) {
    if (!object || typeof object !== "object") {
        return defaultValue;
    }

    for (const key of keys) {
        if (
            Object.prototype.hasOwnProperty.call(object, key) &&
            object[key] !== null &&
            object[key] !== undefined
        ) {
            return object[key];
        }
    }

    return defaultValue;
}


/*
 * Update the first matching element.
 */
function updateElement(ids, value) {
    for (const id of ids) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
            return;
        }
    }
}


/*
 * Convert efficiency to a display percentage.
 */
function formatPercentage(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    return Math.max(0, Math.min(100, number)).toFixed(0) + "%";
}


/*
 * Convert status into a CSS-friendly class.
 */
function getStatusClass(status) {
    const normalized =
        String(status || "")
            .trim()
            .toLowerCase();

    switch (normalized) {
        case "assigned":
            return "assigned";

        case "in progress":
        case "in-progress":
        case "in_progress":
            return "in-progress";

        case "resolved":
            return "resolved";

        case "pending":
            return "pending";

        default:
            return "unknown";
    }
}


/*
 * Prevent HTML injection when displaying database values.
 */
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
 * Show a dashboard error without breaking the page.
 */
function showDashboardError(message) {
    let errorElement =
        document.getElementById("dashboardError");

    if (!errorElement) {
        const dashboard =
            document.querySelector(".dashboard") ||
            document.querySelector("main") ||
            document.body;

        errorElement = document.createElement("div");
        errorElement.id = "dashboardError";
        errorElement.className = "dashboard-error";

        dashboard.prepend(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
}
