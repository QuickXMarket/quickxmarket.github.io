import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

const RiderWallet = () => {
  const { makeRequest, user } = useAppContext();
  const { riderId } = useOutletContext();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await makeRequest({
          url: `/api/wallet/rider`,
          method: "GET",
        });

        if (res.success) {
          setWallet(res.wallet);
        } else {
          toast.error("Failed to fetch wallet");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) fetchWallet();
  }, [user, makeRequest]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-2xl font-medium text-primary">Loading wallet...</p>
      </div>
    );
  if (!wallet) return <div className="p-4">No wallet found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Wallet Summary Card */}
      <div className="bg-white rounded-2xl shadow-md px-6 py-4 mb-6 flex flex-col gap-4">
        <div>
          <p className="text-gray-500 text-sm">Available Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">
            ₦{wallet.balance.toLocaleString()}
          </h2>
        </div>
        <div className="w-full flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:bg-primary/90">
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {wallet.transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No transactions yet.
          </p>
        ) : (
          wallet.transactions.toReversed().map((tx, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm rounded-lg px-4 py-3 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-sm text-gray-800">
                  {tx.description || "Transaction"}
                </h3>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "debit" || tx.type === "withdrawal"
                      ? "text-red-500"
                      : "text-primary"
                  }`}
                >
                  {tx.type === "debit" || tx.type === "withdrawal" ? "-" : "+"}₦
                  {tx.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(tx.createdAt).toLocaleString()}</span>
                <span className="capitalize">{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiderWallet;
