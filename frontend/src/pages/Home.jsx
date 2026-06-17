import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-white text-slate-900">
            <header className="home-hero px-6 py-12 lg:px-16 lg:py-20">
                <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-700"></span>
                            Store rating made effortless
                        </span>
                        <h1 className="mt-7 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Discover, rate, and manage stores with confidence.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            StoreRater is a complete review platform for administrators, store owners, and customers. Get started with secure login, powerful dashboards, and easy rating workflows.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-700">
                                Get Started
                            </Link>
                            <Link to="/signup" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                                Create Account
                            </Link>
                        </div>
                    </div>
                    <div className="home-feature-card rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-slate-900">What you can do</h2>
                        <ul className="mt-6 space-y-4 text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-3 w-3 rounded-full bg-blue-600"></span>
                                <span>Admin dashboard with totals for users, stores, and ratings.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-3 w-3 rounded-full bg-blue-600"></span>
                                <span>Normal users can search stores, submit ratings, and update reviews.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-3 w-3 rounded-full bg-blue-600"></span>
                                <span>Store owners can review customer feedback and monitor average ratings.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-3 w-3 rounded-full bg-blue-600"></span>
                                <span>Admin can create users and stores, manage roles, and protect the reserved admin email.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Home;
