import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCoreContext } from "../context/CoreContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const { axios, navigate } = useCoreContext();

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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const { data } = await axios.post("/api/mail/contact", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Message sent successfully.");
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
    <>
      <Navbar />
      <div className="">
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col gap-4 w-full max-w-md p-8 rounded-lg shadow-xl border border-gray-200 bg-white"
          >
            <p className="text-2xl font-medium text-center mb-4">
              <span className="text-primary">Contact</span> Us
            </p>

            <div className="w-full">
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="border border-gray-200 rounded w-full p-2 outline-primary"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="border border-gray-200 rounded w-full p-2 outline-primary"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full">
              <label htmlFor="subject" className="block mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="border border-gray-200 rounded w-full p-2 outline-primary"
                required
                disabled={loading}
              />
            </div>

            <div className="w-full">
              <label htmlFor="attachment" className="block mb-1">
                Attachment (optional)
              </label>
              <input
                id="attachment"
                type="file"
                onChange={onAttachmentChange}
                className="w-full border border-gray-200 rounded cursor-pointer"
                disabled={loading}
              />
              {attachment && (
                <p className="mt-1 text-sm text-gray-600">{attachment.name}</p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="message" className="block mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                className="border border-gray-200 rounded w-full p-2 outline-primary resize-y"
                rows={5}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-primary transition-all text-white w-full py-2 rounded-md cursor-pointer ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-dull"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
