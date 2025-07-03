import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
  const { makeRequest, navigate, fileToBase64, user } = useAppContext();
  const fileInputRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const name = user.name;
      const email = user.email;
      let attachmentName = null;
      let attachmentBase64 = null;

      if (attachment) {
        attachmentBase64 = await fileToBase64(attachment);
        attachmentName = attachment.name;
      }

      const formData = {
        name,
        email,
        subject,
        message,
        attachment: { base64: attachmentBase64, name: attachmentName },
      };

      const data = await makeRequest({
        method: "POST",
        url: "/api/mail/contact",
        data: formData,
      });

      if (data.success) {
        toast.success("Message sent successfully.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow p-5 sm:p-6 md:p-8 space-y-4"
      >
        <p className="text-xl sm:text-2xl font-medium text-center mb-2">
          <span className="text-primary">Contact</span> Us
        </p>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm mb-1">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-primary"
            required
            disabled={loading}
          />
        </div>

        {/* Custom Attachment Button */}
        <div>
          <label className="block text-sm mb-1">Attachment (optional)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onAttachmentChange}
            className="hidden"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="text-sm px-4 py-2 border rounded bg-white hover:bg-gray-100 transition"
          >
            {attachment ? "Change File" : "Attach File"}
          </button>
          {attachment && (
            <p className="mt-1 text-sm text-gray-600 truncate">
              {attachment.name}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-primary resize-y"
            rows={5}
            required
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-sm font-medium rounded-md text-white bg-primary transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dull"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
