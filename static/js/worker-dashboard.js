/* =====================================================
   SMARTCLEAN — WORKER DASHBOARD JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       SAMPLE WORKER DATA
       Later this can come from Flask/MySQL
    ================================================= */

    const worker = {
        name: "Ravi Kumar",
        id: "WRK-1001"
    };


    const tasks = [
        {
            id: "CW-1042",
            title: "Overflowing bin near bus stop",
            location: "MG Road, near Bus Stop 4",
            status: "In Progress"
        },
        {
            id: "CW-1051",
            title: "Broken dustbin lid",
            location: "Lakeview Colony, Gate 2",
            status: "Pending"
        },
        {
            id: "CW-1038",
            title: "Garbage pile uncollected",
            location: "2nd Cross Street",
            status: "Completed"
        },
        {
            id: "CW-1057",
            title: "Waste collection required",
            location: "Green Park Road",
            status: "Pending"
        }
    ];


    /* =================================================
       WORKER NAME
    ================================================= */

    const workerName =
        document.getElementById("workerName");

    const profileName =
        document.getElementById("profileName");

    const profileId =
        document.getElementById("profileId");


    if (workerName) {
        workerName.textContent = worker.name;
    }

    if (profileName) {
        profileName.textContent = worker.name;
    }

    if (profileId) {
        profileId.textContent = worker.id;
    }


    /* =================================================
       TODAY'S DATE
    ================================================= */

    const todayDate =
        document.getElementById("todayDate");


    if (todayDate) {

        const today = new Date();

        const options = {
            day: "numeric",
            month: "short",
            year: "numeric"
        };

        todayDate.textContent =
            today.toLocaleDateString(
                "en-IN",
                options
            );
    }


    /* =================================================
       RENDER TASKS
    ================================================= */

    const taskList =
        document.getElementById("taskList");


    function getStatusClass(status) {

        if (status === "Completed") {
            return "done";
        }

        if (status === "In Progress") {
            return "progress";
        }

        return "pending";
    }


    function getStatusIcon(status) {

        if (status === "Completed") {
            return "✓";
        }

        if (status === "In Progress") {
            return "⏳";
        }

        return "📋";
    }


    function renderTasks() {

        if (!taskList) {
            return;
        }


        taskList.innerHTML = "";


        tasks.forEach(function (task, index) {

            const item =
                document.createElement("div");


            item.className = "task-item";


            item.style.animation =
                `dashboardAppear 0.5s ease ${index * 0.08}s both`;


            item.innerHTML = `

                <div class="task-info">

                    <div class="task-icon">
                        ${getStatusIcon(task.status)}
                    </div>

                    <div class="task-text">

                        <strong>
                            ${task.id} · ${task.title}
                        </strong>

                        <span>
                            ${task.location}
                        </span>

                    </div>

                </div>

                <span class="task-status ${getStatusClass(task.status)}">

                    ${task.status}

                </span>

            `;


            taskList.appendChild(item);

        });

    }


    renderTasks();


    /* =================================================
       PROFILE MODAL
    ================================================= */

    const profileButton =
        document.getElementById("profileButton");

    const profileQuickButton =
        document.getElementById("profileQuickButton");

    const profileModal =
        document.getElementById("profileModal");

    const closeProfile =
        document.getElementById("closeProfile");

    const modalOverlay =
        profileModal
            ? profileModal.querySelector(".modal-overlay")
            : null;


    function openProfile() {

        if (!profileModal) {
            return;
        }

        profileModal.hidden = false;

        document.body.style.overflow = "hidden";
    }


    function closeProfileModal() {

        if (!profileModal) {
            return;
        }

        profileModal.hidden = true;

        document.body.style.overflow = "";
    }


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            openProfile
        );

    }


    if (profileQuickButton) {

        profileQuickButton.addEventListener(
            "click",
            openProfile
        );

    }


    if (closeProfile) {

        closeProfile.addEventListener(
            "click",
            closeProfileModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeProfileModal
        );

    }


    /* =================================================
       ESCAPE KEY CLOSES MODAL
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                profileModal &&
                !profileModal.hidden
            ) {

                closeProfileModal();

            }

        }
    );


    /* =================================================
       LOGOUT
    ================================================= */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {
                    return;
                }


                /*
                   Later this can call Flask:

                   fetch("/worker-logout", {
                       method: "POST"
                   })
                */


                window.location.href =
                    "/worker-login";

            }
        );

    }


    /* =================================================
       SIMPLE STATISTICS ANIMATION
    ================================================= */

    function animateNumber(
        elementId,
        target
    ) {

        const element =
            document.getElementById(elementId);


        if (!element) {
            return;
        }


        let current = 0;

        const duration = 800;

        const intervalTime = 30;

        const increment =
            target /
            (duration / intervalTime);


        const timer =
            setInterval(function () {

                current += increment;


                if (current >= target) {

                    current = target;

                    clearInterval(timer);

                }


                element.textContent =
                    Math.floor(current);

            }, intervalTime);

    }


    animateNumber(
        "assignedCount",
        12
    );


    animateNumber(
        "pendingCount",
        5
    );


    animateNumber(
        "completedCount",
        7
    );


});