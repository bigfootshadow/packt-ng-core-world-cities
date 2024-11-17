# About

This is a learn project based on `ASP.NET Core 8 and Angular` book by Packt (Sixth Edition)

# Notes

## Angular

Installing Angular Materials

`ng add @angular/material@17.0.3`

Switch from CSS to Sass (SCSS)

`ng add schematics-scss-migrate`

Adding nesting component in the same forlder as parent `--flat` flag

e.g. `ng g c parent/child --flat`

## MS SQL

Run in a Docker container

`docker pull mcr.microsoft.com/mssql/server:2022-latest`

```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>" `
   -p 1433:1433 --name sql1 --hostname sql1 `
   -d `
   mcr.microsoft.com/mssql/server:2022-latest
```

Your password should follow the SQL Server default password policy, otherwise the container can't set up SQL Server, and stops working. By default, the password must be at least eight characters long and contain characters from three of the following four sets: uppercase letters, lowercase letters, base-10 digits, and symbols. You can examine the error log by using the docker logs command.

ref: https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16&tabs=cli&pivots=cs1-powershell