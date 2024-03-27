const NotifyModel = require('../models/notification');

const addNotification = async (userId, notification) => {
    try {
        // Find the document with the given userId
        let notifyDocument = await NotifyModel.findOne({ userId });

        // If the document doesn't exist, create a new one
        if (!notifyDocument) {
            notifyDocument = new NotifyModel({ userId });
        }

        // Add the new notification to the array
        notifyDocument.notification.push(notification);

        // Save the document
        await notifyDocument.save();

        console.log('Notification added successfully.');
    } catch (error) {
        console.error('Error adding notification:', error.message);
    }
};

module.exports = {addNotification};
