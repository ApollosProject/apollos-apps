# Setting up Rock for Apollos

## Creating an API user

(todo)

## Unlocking Rock Endpoints

In order for user authentication to work, we need to open up a single Rock REST endpoint. The `People/GetCurrentPerson` endpoint is used extesivly by Apollos to perform user authentication, and needs to be opened up so any user can call that endpoint (not just our API user.)

### Steps to Unlock

1. Visit the Admin Tools -> Security Page
![step1](./doc-images/cu-step1.png)
2. Click on the "Rest Controllers" block
![step2](./doc-images/cu-step2.png)
3. Find and open the People Controller. It might not be on the first page.
![step3](./doc-images/cu-step3.png)
4. From the People Controller, select the `GetCurrentPerson` endpoint security settings.
![step4](./doc-images/cu-step4.png)
5. From the "View" tab, select "Add Role"
![step5](./doc-images/cu-step5.png)
6. Select "All Users" from the dropdown.
![step6](./doc-images/cu-step6.png)
7. With "All Users" and the "View" checkbox checked, click "Add"
![step7](./doc-images/cu-step7.png)


## Configuring Content Channels

(todo)