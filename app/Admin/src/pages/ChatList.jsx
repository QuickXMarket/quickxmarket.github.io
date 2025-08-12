import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ChatTopBar from "../components/ChatTopBar";
import { useChatContext } from "../context/ChatContext";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";

const ChatList = () => {
  const { chatList } = useChatContext();
  const { getRelativeDayLabel, navigate } = useCoreContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState(chatList);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chatList);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = chatList.filter(
        (chat) =>
          chat.user.name.toLowerCase().includes(lowerCaseQuery) ||
          chat.user.email.toLowerCase().includes(lowerCaseQuery) ||
          chat._id.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredChats(chatList);
  }, [chatList]);

  return (
    <div className="flex flex-col h-full w-full bg-background">
     
      <div className="px-4 pt-3 pb-6">
        {/* Search Input */}
        <label className="flex flex-col min-w-40 h-12 w-full mb-4">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card">
            <div className="text-primary flex items-center justify-center pl-4 rounded-l-lg bg-card border-r border-border">
              <Search className="w-5 h-5" />
            </div>
            <input
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex-1 bg-card text-text placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none px-4 rounded-r-lg text-base"
            />
          </div>
        </label>

        {filteredChats.map((chat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-card px-4 min-h-[72px] py-2 rounded-lg mb-2"
            onClick={() => navigate(`/contact/${chat._id}`)}
          >
            <div className="flex items-center gap-4 min-w-0">
              {" "}
              {/* prevents overflow */}
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 shrink-0"
                style={{ backgroundImage: `url(${assets.profile_icon})` }}
              ></div>
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-text text-base font-medium leading-normal truncate">
                  {chat.user.name}
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal truncate">
                  {chat.user.email}
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-xs ml-4 self-center whitespace-nowrap max-w-[100px] text-right truncate">
              {getRelativeDayLabel(chat.lastUpdated)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
