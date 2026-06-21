import React, { useEffect, useState } from "react"
import {
    MessageCircle, Send, Search, Plus, Edit, Trash2, Eye, EyeOff, User, Users, Bell, Clock, X
} from "lucide-react"


const Communication = () => {
    const [messages, setMessages] = useState([])
    const [showNewMessageForm, setShowNewMessageForm] = useState(false)
    const [editMessage, setEditMessage] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [messageType, setMessageType] = useState("GENERAL")
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [currentUser] = useState("John Doe") // In a real app, this would come from auth context

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/messages")
            if (!res.ok) throw new Error("Failed to load messages")
            const data = await res.json()
            setMessages(data)
        } catch (e) {
            console.error(e)
            alert("Could not fetch messages. Please check backend.")
        }
    }

    const handleAddMessage = async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const payload = {
            senderName: currentUser,
            content: fd.get("content"),
            recipientName: fd.get("recipientName") || null,
            messageType: fd.get("messageType")
        }

        try {
            const res = await fetch("http://localhost:8080/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to create message")

            await fetchMessages()
            setShowNewMessageForm(false)
            e.target.reset()
        } catch (e) {
            console.error(e)
            alert("Could not create message: " + e.message)
        }
    }

    const handleEditMessage = async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const payload = {
            content: fd.get("content"),
            recipientName: fd.get("recipientName") || null,
            messageType: fd.get("messageType")
        }

        try {
            const res = await fetch(`http://localhost:8080/api/messages/${editMessage.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to update message")

            await fetchMessages()
            setEditMessage(null)
        } catch (e) {
            console.error(e)
            alert("Could not update message: " + e.message)
        }
    }

    const handleDeleteMessage = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            const res = await fetch(`http://localhost:8080/api/messages/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete message")

            await fetchMessages()
        } catch (e) {
            console.error(e)
            alert("Could not delete message: " + e.message)
        }
    }

    const handleMarkAsRead = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/messages/${id}/read`, {
                method: "PUT",
            })

            if (!res.ok) throw new Error("Failed to mark message as read")

            await fetchMessages()
        } catch (e) {
            console.error(e)
            alert("Could not mark message as read: " + e.message)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchMessages()
            return
        }

        try {
            const res = await fetch(`http://localhost:8080/api/messages/search?query=${encodeURIComponent(searchQuery)}`)
            if (!res.ok) throw new Error("Failed to search messages")
            const data = await res.json()
            setMessages(data)
        } catch (e) {
            console.error(e)
            alert("Could not search messages: " + e.message)
        }
    }

    const handleFilterByType = async (type) => {
        setMessageType(type)
        try {
            const res = await fetch(`http://localhost:8080/api/messages/type/${type}`)
            if (!res.ok) throw new Error("Failed to filter messages")
            const data = await res.json()
            setMessages(data)
        } catch (e) {
            console.error(e)
            alert("Could not filter messages: " + e.message)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString()
    }

    const getMessageTypeIcon = (type) => {
        switch (type) {
            case "DIRECT": return <User className="w-4 h-4" />
            case "GROUP": return <Users className="w-4 h-4" />
            case "ANNOUNCEMENT": return <Bell className="w-4 h-4" />
            default: return <MessageCircle className="w-4 h-4" />
        }
    }

    const getMessageTypeColor = (type) => {
        switch (type) {
            case "DIRECT": return "bg-blue-100 text-blue-800"
            case "GROUP": return "bg-green-100 text-green-800"
            case "ANNOUNCEMENT": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const filteredMessages = messages.filter(msg =>
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.recipientName && msg.recipientName.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Communication & Collaboration</h1>
                <button
                    onClick={() => setShowNewMessageForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Message
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Search
                </button>
                <select
                    value={messageType}
                    onChange={(e) => handleFilterByType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="GENERAL">All Messages</option>
                    <option value="DIRECT">Direct Messages</option>
                    <option value="GROUP">Group Messages</option>
                    <option value="ANNOUNCEMENT">Announcements</option>
                </select>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Messages ({messages.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {filteredMessages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No messages found. Create your first message!</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!message.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(message.messageType)}`}>
                                                {getMessageTypeIcon(message.messageType)}
                                                {message.messageType}
                                            </div>
                                            {!message.isRead && (
                                                <div className="flex items-center gap-1 text-blue-600 text-xs">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    Unread
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <span className="font-medium">{message.senderName}</span>
                                            {message.recipientName && (
                                                <>
                                                    <span>→</span>
                                                    <span className="font-medium">{message.recipientName}</span>
                                                </>
                                            )}
                                        </div>

                                        <p className="text-gray-900 mb-2 line-clamp-2">{message.content}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(message.createdAt)}
                                            </div>
                                            {message.updatedAt !== message.createdAt && (
                                                <div className="flex items-center gap-1">
                                                    <Edit className="w-3 h-3" />
                                                    Edited {formatDate(message.updatedAt)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => setSelectedMessage(message)}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="View details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditMessage(message)}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit message"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {!message.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(message.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                title="Mark as read"
                                            >
                                                <EyeOff className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteMessage(message.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete message"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* New Message Form */}
            {showNewMessageForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">New Message</h3>
                            <button
                                onClick={() => setShowNewMessageForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddMessage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Type
                                </label>
                                <select
                                    name="messageType"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="DIRECT">Direct Message</option>
                                    <option value="GROUP">Group Message</option>
                                    <option value="ANNOUNCEMENT">Announcement</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient (optional)
                                </label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    placeholder="Enter recipient name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Content *
                                </label>
                                <textarea
                                    name="content"
                                    required
                                    rows={4}
                                    placeholder="Enter your message..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Send Message
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewMessageForm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Message Form */}
            {editMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Edit Message</h3>
                            <button
                                onClick={() => setEditMessage(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditMessage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Type
                                </label>
                                <select
                                    name="messageType"
                                    defaultValue={editMessage.messageType}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="DIRECT">Direct Message</option>
                                    <option value="GROUP">Group Message</option>
                                    <option value="ANNOUNCEMENT">Announcement</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient
                                </label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    defaultValue={editMessage.recipientName || ""}
                                    placeholder="Enter recipient name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Content *
                                </label>
                                <textarea
                                    name="content"
                                    required
                                    rows={4}
                                    defaultValue={editMessage.content}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update Message
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMessage(null)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Message Details</h3>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(selectedMessage.messageType)}`}>
                                    {getMessageTypeIcon(selectedMessage.messageType)}
                                    {selectedMessage.messageType}
                                </div>
                                {!selectedMessage.isRead && (
                                    <div className="flex items-center gap-1 text-blue-600 text-xs">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        Unread
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{selectedMessage.senderName}</span>
                                {selectedMessage.recipientName && (
                                    <>
                                        <span className="mx-2">→</span>
                                        <span className="font-medium">{selectedMessage.recipientName}</span>
                                    </>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <div>Created: {formatDate(selectedMessage.createdAt)}</div>
                                {selectedMessage.updatedAt !== selectedMessage.createdAt && (
                                    <div>Last updated: {formatDate(selectedMessage.updatedAt)}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Communication
