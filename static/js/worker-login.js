/* =====================================================
   SMARTCLEAN — WORKER LOGIN JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("workerLoginForm");

    const workerId =
        document.getElementById("workerId");

    const password =
        document.getElementById("workerPassword");

    const togglePassword =
        document.getElementById("togglePassword");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const loginMessage =
        document.getElementById("loginMessage");


    /* =================================================
       SHOW / HIDE PASSWORD
    ================================================= */

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (password.type === "password") {

                    password.type = "text";

                    togglePassword.textContent = "🙈";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    password.type = "password";

                    togglePassword.textContent = "👁";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }


    /* =================================================
       DISPLAY MESSAGE
    ================================================= */

    function showMessage(message, type) {

        loginMessage.textContent = message;

        loginMessage.className =
            "login-message show " + type;

    }


    /* =================================================
       LOGIN FORM
    ================================================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const id =
                    workerId.value.trim();

                const pass =
                    password.value.trim();


                /* -----------------------------------------
                   BASIC VALIDATION
                ----------------------------------------- */

                if (!id) {

                    showMessage(
                        "Please enter your Worker ID.",
                        "error"
                    );

                    workerId.focus();

                    return;

                }


                if (!pass) {

                    showMessage(
                        "Please enter your password.",
                        "error"
                    );

                    password.focus();

                    return;

                }


                /* -----------------------------------------
                   BUTTON LOADING STATE
                ----------------------------------------- */

                const loginButton =
                    loginForm.querySelector(
                        ".worker-login-button"
                    );


                const originalText =
                    loginButton.innerHTML;


                loginButton.disabled = true;

                loginButton.innerHTML =
                    `<span>Signing in...</span> <strong>⏳</strong>`;


                try {

                    /* =====================================
                       SEND LOGIN DATA TO FLASK
                    ===================================== */

                    const response =
                        await fetch(
                            "/worker-login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    workerId: id,

                                    password: pass

                                })

                            }
                        );


                    const data =
                        await response.json();


                    /* =====================================
                       SUCCESS
                    ===================================== */

                    if (response.ok && data.success) {

                        showMessage(
                            "Login successful! Redirecting...",
                            "success"
                        );


                        setTimeout(
                            function () {

                                window.location.href =
                                    "/worker-dashboard";

                            },
                            700
                        );

                    }


                    /* =====================================
                       LOGIN FAILED
                    ===================================== */

                    else {

                        showMessage(
                            data.message ||
                            "Invalid Worker ID or password.",
                            "error"
                        );

                        loginButton.disabled = false;

                        loginButton.innerHTML =
                            originalText;

                    }

                }


                /* =========================================
                   SERVER / NETWORK ERROR
                ========================================= */

                catch (error) {

                    console.error(
                        "Worker login error:",
                        error
                    );


                    showMessage(
                        "Unable to connect to the server. Please try again.",
                        "error"
                    );


                    loginButton.disabled = false;

                    loginButton.innerHTML =
                        originalText;

                }

            }
        );

    }


    /* =================================================
       FORGOT PASSWORD
    ================================================= */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                showMessage(
                    "Please contact the municipal administrator to reset your password.",
                    "error"
                );

            }
        );

    }


    /* =================================================
       REMOVE ERROR MESSAGE WHEN USER TYPES
    ================================================= */

    if (workerId) {

        workerId.addEventListener(
            "input",
            function () {

                if (loginMessage) {

                    loginMessage.className =
                        "login-message";

                }

            }
        );

    }


    if (password) {

        password.addEventListener(
            "input",
            function () {

                if (loginMessage) {

                    loginMessage.className =
                        "login-message";

                }

            }
        );

    }

});