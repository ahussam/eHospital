# eHospital v 0.1 

A web-based Hospital Management System with a recovery backup feature that can recover the system in the case of a ransomware attack happens.

## Graduation Project Details :card_file_box:	
* Students: Abdullah Hussam, Cenaa Ghani
* Supervisor: Dr. Ahmed Saad 
* Graduation Year: 2020
* Discussion Board: TBD
* Presentation: TBD
* Blog Post: http://ahussam.me/make-encrypted-backup-with-multiple-subkeys-in-NodeJS/

## Features :ballot_box_with_check:	

  - Access conrtol with 4 roles in system(Admin, Doctor, Receptionist, pharmacist). 
  - Login and password reset functions. 
  - Export encrypted backup and send it to a third party. 
  - Import encrypted backup and deploy it on server.
  - Add new user and update existing ones. 
  - ... 

## Code Organisation :open_file_folder:	

```
+---encryptedBackUp // Encyption backup script 
+---models // Database models 
+---routes // Routing and logic 
+---views 
       \---ui
        +---admin // Admin pages
        +---doctor // Doctor pages
        +---pharmacist // Pharmacist pages
        \---receptionist // Receptionist pages
```

## Technologies :hammer_and_wrench:	
### Backend :gear: : 
| Name | Description | Link 
| ------ | ------ | ------
| Nodejs | Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine| https://nodejs.org/en/
Express.js | Express.js, or simply Express, is a web application framework for Node.js | https://expressjs.com/ 
MongoDB | MongoDB is a cross-platform document-oriented database program. |https://www.mongodb.com/
Mongoose |Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node|https://mongoosejs.com/|
Vash|Vash is a template view engine that uses Razor Syntax|https://github.com/kirbysayshi/vash|
...|...|...|

### Frontend :desktop_computer:  
| Name | Description | Link 
| ------ | ------ | ------
| Admin Wrap Lite |  Dashboard template | https://www.wrappixel.com/
| Bootstrap |  The most popular HTML, CSS, and JS library in the world. | https://getbootstrap.com/
Font Awesome|The world's most popular and easiest to use icon|https://fontawesome.com/|
...|...|...|

### Database Schema :card_file_box:	 
![DB](/ss/db.png)

------


### REST API :link:	

| URL | Description 
| ------ | ------ | 
/admin/api/ | Admin operations 
/doctor/api/| Doctor operations 
/receptionist/api/| Receptionist operations 
/pharmacist/api/| Pharmacist operations

------

### Encrypted Backup :package:	

Use Cron to trigger `/encryptedBackUp/encryptPatientsRecords.js` 
* Read more at [https://ahussam.me/make-encrypted-backup-with-multiple-subkeys-in-NodeJS/](https://ahussam.me/make-encrypted-backup-with-multiple-subkeys-in-NodeJS/)

------


### Deployment :rocket:	

```
root@ubuntu:~# git clone https://github.com/ahussam/eHospital.git
root@ubuntu:~# cd eHospital
root@ubuntu:~/eHospital# npm install 
root@ubuntu:~/eHospital# node server.js 
```

Then go to [http://127.0.0.1:3000](http://127.0.0.1:3000) 

------

#### Test Credentials :key:	

| Role | Email | Password 
| ------ | ------ | -------
Admin | admin@admin.com| 123456
Doctor| doctor@doctor.com| 123456
Receptionist|receptionist@receptionist.com|123456
Pharmacist|pharmacist@pharmacist.com|123456 

------

### Screenshots :camera:	
#### Admin UI
![DB](/ss/admin.png)
#### Doctor UI
![DB](/ss/doctor.png)
#### Receptionist UI
![DB](/ss/receptionist.png)
#### Pharmacist UI
![DB](/ss/pharmacist.png)

------

### TODO :white_check_mark: 

- [ ] Implement REST api functions. 
- [ ] Implement XSS filtering before inserting to DB with Dompurify. 
- [ ] Implement CSRF token protection. 
- [ ] Code frontend Ajax calls. 
- [ ] Look for TODO in files to finish them. 
- [ ] Implement database other schema models and link them

------

## License :page_facing_up:	
Free to use, copy and distribute. 

