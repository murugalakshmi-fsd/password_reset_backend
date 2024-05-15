<h1>NodeJsTask:Authentication-Backend</h1>
<p>The backend of the project is responsible for handling the business logic and data processing required for the password reset functionality. It interacts with the database to retrieve user information, generates and sends OTP emails, and updates user records with new password information.</p>
<ul>
  <li>
    <h3>User Authentication:</h3>
    <p>Authenticates users based on their email address.</p>
  </li>
  <li>
    <h3>OTP Generation:</h3>
    <p>Generates a one-time password (OTP) and associates it with the user's account.</p>
  </li>
  <li>
    <h3>Email Sending:</h3>
    <p>Sends an email containing the OTP to the user's registered email address</p>
  </li>
  <li>
    <h3>Password Update:</h3>
    <p>Updates the user's password with the new password provided by the user after verifying the OTP.
</p>
  </li>
</ul>
