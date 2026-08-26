from flask import Flask, render_template, request, redirect, session

app = Flask(__name__)
app.secret_key = "smart-civic-secret-key"
def validate_password(password):
    if len(password) < 6:
        return False

    if not any(char.isupper() for char in password):
        return False

    if not any(char.isdigit() for char in password):
        return False

    return True

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/report-issue")
def report_issue():
    return render_template("report-issue.html")
@app.route("/track")
def track():
    return render_template("track.html")
@app.route("/worker-login", methods=["GET", "POST"])
def worker_login():

    if request.method == "POST":

        data = request.get_json()

        if not data:
            return {
                "success": False,
                "message": "Invalid request."
            }, 400

        worker_id = data.get("workerId")
        password = data.get("password")

        # Temporary worker credentials
        if worker_id == "WRK-1001" and password == "worker123":
            session["user_id"] = worker_id
            session["role"] = "worker"
            return {
                "success": True,
                "message": "Login successful!"
            }

        return {
            "success": False,
            "message": "Invalid Worker ID or password."
        }, 401

    return render_template("worker-login.html")
@app.route("/worker-dashboard")
def worker_dashboard():
    #check wetther the worker is logged in or not
    if session.get("role")!= "worker":
        return redirect("/worker-login")
    return render_template("worker-dashboard.html")

@app.route("/worker-complaints")
def worker_complaints():
    return render_template("worker-complaints.html")
@app.route("/worker-reports")
def worker_reports():
    return render_template("worker-reports.html")
@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")

        # Temporary login
        if email == "admin@smartclean.com" and password == "admin123":
            session["user_id"] = email
            session["role"] = "admin"   
            return redirect("/admin-dashboard")
        return "Invalid admin credentials"

    return render_template("admin-login.html")
@app.route("/admin-dashboard")
def admin_dashboard():
    #Only authenticated admins can access the dashboard
    if session.get("role") != "admin":
        return redirect("/admin-login")
    return render_template("admin-dashboard.html")

@app.route("/admin-complaints")
def admin_complaints():
    return render_template("admin-complaints.html")

@app.route("/admin-workers")
def admin_workers():
    return render_template("admin-workers.html")

@app.route("/admin-reports")
def admin_reports():
    return render_template("admin-reports.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/citizen-login", methods=["GET", "POST"])
def citizen_login():

    if request.method == "POST":

        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        # Basic validation
        if not email or not password:
            return "Email and password are required.", 400

        # Temporary credentials for testing
        if email == "citizen@example.com" and password == "citizen123":

            session["user_id"] = email
            session["role"] = "citizen"

            return redirect("/citizen-dashboard")

        return "Invalid email or password.", 401

    return render_template("citizen-login.html")
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        phone = request.form.get("phone", "").strip()
        location = request.form.get("location", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")
        #Basic backend validation
        if not name or not email or not phone or not location or not password:
            return "All fields are required.", 400
        if not validate_password(password):
            return render_template("register.html", error="Password must be at least 6 characters long, contain at least one uppercase letter and one number."), 400
        if len(phone)!=10 or not phone.isdigit():
            return "Phone number must be 10 digits.", 400
    
        # MySQL database insertion will be added later.

        return redirect("/citizen-login")

    return render_template("register.html")


@app.route("/citizen-dashboard")
def citizen_dashboard():
    return render_template("citizen-dashboard.html")
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")
@app.route("/worker-logout")
def worker_logout():

    session.clear()

    return redirect("/worker-login")
@app.route("/admin-logout")
def admin_logout():

    session.clear()

    return redirect("/admin-login")

if __name__ == "__main__":
    app.run(debug=True)
