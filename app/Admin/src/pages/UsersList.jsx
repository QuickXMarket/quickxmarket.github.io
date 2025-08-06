import React from "react";
import { Search } from "lucide-react";
import { assets } from "../assets/assets";

const users = [
  {
    name: "Alice Smith",
    email: "alice.smith@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByqT97r43T3js-GosoW-5iQbvpy-D3Gg4yQfnccBQbRCOl0wvP-_3-dKRXqehGAnSW36rIQSAxZQKoS_WDA5KX-jIHb9Wnly7-HruAtYSvl2lZ0GWfBWEzMMCsuif825TlCYMpAkRU7AGxx4oGnJH-4TSopyvT_yTqucwmLUUcacQtjH1z1fIg_dh8BwQXMvuNRihl8rppcT8BJGH6Ir_vM8CD1bsPjK1d5hIp7p8aWodN8QVEcpDX2sHE3Bnqv5YA3Ak26meYc55m",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAw0D78fdID5wZkCZYZy3j0UDq6WY-0ORxqY5IakELtrvc6195o3IefXLXv3CFFJkZt-dxWkAt22tX6RRqeKNJfNW3zMW98RlPSb9fkjCEdvyMpZ-4yyRp8NnDs_a_jzray5Yw5ceuFH9yxx0D0nCfAK6DSJpnylKFqlIr6kiDzQW7WS8ggmuwVsJTLPB86Dvaa-M2DHwJwLDQt3YQAsSDXvelbFxU_JYyMebtt2zgHl2-ZyYRQMK18sOZ6PS1kFbcIAdACZLSILDT0",
  },
  {
    name: "Charlie Brown",
    email: "charlie.brown@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiwPu21UkrxgH5slNMOLO-a-dy3VOJ2GikTOaKd84pG04zBPV92aUmHSzR0x3NuIZzCweb4nUQZ6RFNmDYwhypBuI6hNgt3I3vNlJ9wQ3ZcZRTYDc26O5knZ7Wewey7gFpgqzXxHPHJmKP-codSgtsCL6A5Tk7hW9NsIdB-ODBiYxBp1VtExngbKc7seCds64ZmzgKl6CgdQb_jg3WktOvogMO5BJHmCYvEtbaiQyLWevgZ9EyZJ6KZsmSCv-usw46pOJaFQcqxzyr",
  },
  {
    name: "Diana Evans",
    email: "diana.evans@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmR66FvskrIoqR4hedJvwrj1f3yKFbyoUSGhtjdHI19ZZmWiGjT8yh9CrUfjKgs-H1olPyR0V3QTwBWHSXj087udarFHzC952RZ6j2QdmCkQ-viOdg-zz0Q8dB45KobbAcyuwpz6_YqZduihIXCDRvFyIFz9afcJ_MbUMO37Og5bKXj1lSSPnTgA3uZs3IBGn8Nt6-yt8DaRfRrhMOmm0SFX5O8OCS3Dg2EzoE6ZW5k4V47tVlanSY7sTs4SRJRk3dRIkEMWNSK7e9",
  },
  {
    name: "Edward Green",
    email: "edward.green@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKF9YsoHHdB9lMHYQRgFYGh2MIn5pztHol0nofPcr7I9BPwBM1bOSSo5m7PMW3wl-yJbKRsdTlzdH1fwpdFCNdoDJUbR6Io7gfOcba5boDP4Pq_RCUv4_JAXNZygkvqlVqpnK0zdwyNm6kGrTxn73ao6Y2qFaRHULPQvekTVP22PUt8-f8L2EXkEJB5DSDO28-oo7D4j7LrJ6TSYZIzLw7Tdzok79B9HDHfTLift9bIY9AQrt5boOXqeo9BQw7-pGWU7i5zgFa2Psw",
  },
];

const UserList = () => {
  return (
    <div className="px-4 pt-3 pb-6">
      {/* Search Input */}
      <label className="flex flex-col min-w-40 h-12 w-full mb-4">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card">
          <div className="text-primary flex items-center justify-center pl-4 rounded-l-lg bg-card border-r border-border">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Search users"
            className="form-input flex-1 bg-card text-text placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none px-4 rounded-r-lg text-base"
          />
        </div>
      </label>

      {/* User Items */}
      {users.map((user, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 bg-card px-4 min-h-[72px] py-2 rounded-lg mb-2"
        >
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 shrink-0"
            style={{ backgroundImage: `url(${assets.profile_icon})` }}
          ></div>
          <div className="flex flex-col justify-center">
            <p className="text-text text-base font-medium leading-normal line-clamp-1">
              {user.name}
            </p>
            <p className="text-gray-500 text-sm font-normal leading-normal line-clamp-2">
              {user.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
