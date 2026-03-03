const DAY_IN_MS = 24 * 60 * 60 * 1000

export const TimeStampsHandler = (dateString: string) => {
        const messageDate = new Date(dateString)
        const now = new Date()

        const messageDay = new Date(messageDate)
        messageDay.setHours(0, 0, 0, 0)
        const today = new Date(now)
        today.setHours(0, 0, 0, 0)

        const diffDays = Math.floor((today.getTime() - messageDay.getTime()) / DAY_IN_MS)

        if (diffDays === 0) {
            return messageDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        } else if (diffDays < 7) {
            if (diffDays < 2) {
                return 'Yesterday'
            }
            return messageDate.toLocaleDateString('en-US', {weekday: 'long'})
        } else {
            return messageDate.toLocaleDateString('en-US')
        }
    }