export const getSubscription = () => {
  const sub = localStorage.getItem("subscription");
  return sub ? JSON.parse(sub) : null;
};

export const canAccess = (feature) => {
  const sub = getSubscription();
  if (!sub) return false;

  // Business active → full access
  if (sub.plan === "business" && sub.status === "active") {
    return true;
  }

  // Free plan rules
  switch (feature) {
    case "inventory":
      return true;
    default:
      return false;
  }
};