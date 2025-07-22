import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import PullToRefresh from "pulltorefreshjs";
import { useOutletContext } from "react-router-dom";
import { useCoreContext } from "../../context/CoreContext";
import { useAuthContext } from "../../context/AuthContext";

const VendorWallet = () => {
  const { makeRequest } = useCoreContext();
  const { user } = useAuthContext();
  const { vendor } = useOutletContext();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef();

  const fetchWallet = async () => {
    try {
      const res = await makeRequest({
        url: `/api/wallet/vendor`,
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

  useEffect(() => {
    if (user && user._id) fetchWallet();
  }, [user, makeRequest]);

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

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (withdrawAmount > wallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setSubmitting(true);
    try {
      const res = await makeRequest({
        url: "/api/wallet/withdrawal-request",
        method: "POST",
        data: {
          amount: withdrawAmount,
          description: "Withdrawal",
          walletType: "vendor",
          userId: user._id,
        },
      });

      if (res.success) {
        setWallet(res.wallet);
        setShowModal(false);
        setWithdrawAmount(0);
        toast.success("Withdrawal request submitted");
      } else {
        toast.error(res.message || "Withdrawal failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-2xl font-medium text-primary">Loading wallet...</p>
      </div>
    );
  if (!wallet) return <div className="p-4">No wallet found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto " ref={containerRef}>
      {/* Wallet Summary Card */}
      <div className="bg-white rounded-2xl shadow-md px-6 py-4 mb-6 flex flex-col gap-4">
        <div>
          <p className="text-gray-500 text-sm">Available Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">
            ₦{wallet.balance.toLocaleString()}
          </h2>
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:bg-primary/90"
          >
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

      {/* Withdraw Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-70 max-w-sm rounded-lg p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800">
              Request Withdrawal
            </h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-600 hover:underline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorWallet;
