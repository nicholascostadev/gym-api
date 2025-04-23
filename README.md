Here is your text translated to English:

---

# App

GymPass style app.

## FRs (Functional Requirements)

- [x] It should be possible to register;
- [ ] It should be possible to authenticate;
- [ ] It should be possible to get the profile of a logged-in user;
- [ ] It should be possible to get the number of check-ins performed by the logged-in user;
- [ ] It should be possible for the user to get their check-in history;
- [ ] It should be possible for the user to search for nearby gyms;
- [ ] It should be possible for the user to search for gyms by name;
- [ ] It should be possible for the user to check in at a gym;
- [ ] It should be possible to validate a user's check-in;
- [ ] It should be possible to register a gym;

## BRs (Business Rules)

- [x] The user should not be able to register with a duplicate email;
- [ ] The user cannot perform 2 check-ins on the same day;
- [ ] The user cannot check in if they are not near (100m) the gym;
- [ ] The check-in can only be validated up to 20 minutes after it is created;
- [ ] The check-in can only be validated by administrators;
- [ ] The gym can only be registered by administrators;

## NFRs (Non-Functional Requirements)

- [x] The user's password must be encrypted;
- [x] The application's data must be persisted in a PostgreSQL database;
- [ ] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified by a JWT (JSON Web Token);

---