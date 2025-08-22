import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";

const Feedback = () => {
  const { makeRequest, navigate, fileToBase64 } = useCoreContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        name,
        email,
        subject,
        message,
      };
      if (attachment) {
        const attachmentBase64 = await fileToBase64(attachment);
        formData.attachment = attachmentBase64;
      }

      const data = await makeRequest({
        url: "/api/mail/contact",
        method: "POST",
        data: formData,
      });

      if (data.success) {
        toast.success("Feedback sent successfully.");
        setName("");
        setEmail("");
        setSubject("");
        setAttachment(null);
        setMessage("");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const onAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-200 bg-background sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900">Feedback</h1>
        <p className="text-sm text-gray-500">We'd love to hear your thoughts</p>
      </header>

      {/* Scrollable form */}
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        className=" overflow-y-auto px-4 py-6 space-y-6"
      >
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
          required
          disabled={loading}
        />

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
          required
          disabled={loading}
        />

        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-200 dark:text-text"
          required
          disabled={loading}
        />

        <div>
          <label
            htmlFor="attachment"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            Attachment (optional)
          </label>
          <input
            id="attachment"
            type="file"
            onChange={onAttachmentChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dull"
            disabled={loading}
          />
          {/* {attachment && (
            <p className="mt-2 text-sm text-gray-500">{attachment.name}</p>
          )} */}
        </div>

        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          className="w-full rounded-xl border border-gray-300 p-4 text-base focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 resize-none"
          rows={5}
          required
          disabled={loading}
        />
        <div className="p-4 border-t border-gray-200 bg-background">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-text font-semibold text-lg transition-all text-white ${
              loading
                ? "bg-primary opacity-50 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dull"
            }`}
          >
            {loading ? "Sending Feedback..." : "Send Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
