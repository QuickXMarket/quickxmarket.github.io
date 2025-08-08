import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import PullToRefresh from "pulltorefreshjs";
import { useOutletContext } from "react-router-dom";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";

const VendorWallet = () => {
  const { makeRequest } = useCoreContext();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    PullToRefresh.init({
      mainElement: containerRef.current,
      onRefresh() {
        return fetchWallet();
      },
    });

    return () => PullToRefresh.destroyAll();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-2xl font-medium text-primary">Loading wallet...</p>
      </div>
    );

  return (
    <div className="p-4 max-w-3xl mx-auto " ref={containerRef}>
      {/* Wallet Summary Card */}
      <div className="bg-card rounded-2xl shadow-md px-6 py-4 mb-6 flex flex-col gap-4">
        <div>
          <p className="text-gray-500 text-sm">Total Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">₦{"0"}</h2>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {wallet?.transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            No transactions yet.
          </p>
        ) : (
          wallet?.transactions.toReversed().map((tx, idx) => (
            <div
              key={idx}
              className="bg-card shadow-sm rounded-lg px-4 py-3 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-sm text-gray-800">
                  {tx.description || "Transaction"}
                </h3>
                <span
                  className={`text-sm font-semibold ${
                    (tx.type === "debit" || tx.type === "withdrawal") &&
                    tx.status === "approved"
                      ? "text-red-500"
                      : tx.status === "pending"
                      ? "text-yellow-500"
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

export default VendorWallet;
