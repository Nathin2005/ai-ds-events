# MongoDB Atlas Setup Guide

Since local MongoDB doesn't work with cloud deployments, you'll need to use MongoDB Atlas (cloud MongoDB).

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

## Step 2: Create a Cluster

1. **Choose Deployment Type**: Select "Shared" (Free tier)
2. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
3. **Region**: Select the region closest to your users
4. **Cluster Tier**: M0 Sandbox (Free forever)
5. **Cluster Name**: Leave default or name it "ai-ds-events"
6. Click "Create Cluster"

## Step 3: Create Database User

1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `admin` (or your preferred username)
5. **Password**: Generate a secure password or create your own
6. **Database User Privileges**: Select "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. **Access List Entry**: Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows your deployed app to connect from any IP
   - For production, you can restrict this to specific IPs later
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to **Clusters** in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

It will look like:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Prepare Connection String

1. Replace `<password>` with your database user password
2. Add your database name after the domain:
```
mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/ai-ds-events?retryWrites=true&w=majority
```

## Step 7: Update Environment Variables

### For Local Development
Update your `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/ai-ds-events?retryWrites=true&w=majority
```

### For Production Deployment
Set this as an environment variable in your hosting platform:
- **Railway**: Set in the Variables tab
- **Render**: Set in Environment Variables
- **Heroku**: Use `heroku config:set MONGODB_URI=...`
- **Vercel**: Not needed for frontend

## Step 8: Test Connection

1. Start your backend server locally with the new connection string
2. Check the logs for successful connection
3. Test the API endpoints

## Security Best Practices

1. **Strong Password**: Use a complex password for your database user
2. **IP Whitelist**: In production, restrict IP access to your server IPs only
3. **Regular Rotation**: Rotate passwords periodically
4. **Monitoring**: Enable MongoDB Atlas monitoring and alerts

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check username and password in connection string
   - Ensure database user exists and has correct permissions

2. **Network Timeout**
   - Verify IP address is whitelisted (0.0.0.0/0 for all IPs)
   - Check if your hosting provider's IPs are blocked

3. **Database Not Found**
   - MongoDB will create the database automatically when first document is inserted
   - Make sure database name is included in connection string

### Connection String Format
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://admin:mySecurePassword123@cluster0.abc123.mongodb.net/ai-ds-events?retryWrites=true&w=majority
```

## Free Tier Limitations

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Bandwidth**: No limit

This is sufficient for development and small production apps.

## Next Steps

After setting up MongoDB Atlas:
1. Update your environment variables
2. Deploy your backend
3. Test the deployed API
4. Your events and admin data will be stored in the cloud database