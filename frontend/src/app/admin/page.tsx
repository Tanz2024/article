import AllArticles from "./AllArticles";
import SiteAnalytics from "./SiteAnalytics";
import UsersPanel from "./UsersPanel";
import FlaggedArticlesPanel from "./FlaggedArticlesPanel";

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p className="mb-6">Moderate articles, manage users, and view site analytics here.</p>
      <AllArticles />
      <FlaggedArticlesPanel />
      <SiteAnalytics />
      <UsersPanel />
    </main>
  );
}
