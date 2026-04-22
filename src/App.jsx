import { useState, useEffect } from 'react';
import Shell from './components/Shell';
import LoginPage from './pages/LoginPage';
import TutorialPage from './pages/TutorialPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import QuizPage from './pages/QuizPage';
import CertificatePage from './pages/CertificatePage';
import AdminPage from './pages/AdminPage';
import ContentPage from './pages/ContentPage';

const COURSE_STYLE_KEY = 'ind_courseStyle';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [role, setRole] = useState('alumno');
  const [tutorialDone, setTutorialDone] = useState(() => !!localStorage.getItem('ind_tutorial_seen'));
  const [courseStyle, setCourseStyle] = useState(() => localStorage.getItem(COURSE_STYLE_KEY) || 'aula');
  const [activeCourse, setActiveCourse] = useState('mina_cabildo');
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ind_theme');
    const isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!isDark) {
      document.documentElement.classList.add('light');
    }
  }, []);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('ind_auth_token');
      if (!token) {
        setValidating(false);
        return;
      }

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify', token }),
        });

        const data = await response.json();
        if (data.valid) {
          setRole(data.role);
          // Restore screen based on role
          if (data.role === 'admin') {
            setScreen('admin');
          } else if (tutorialDone) {
            setScreen('dashboard');
          } else {
            setScreen('tutorial');
          }
        } else {
          // Token invalid, clear auth
          localStorage.removeItem('ind_auth_token');
          localStorage.removeItem('ind_user_role');
          localStorage.removeItem('ind_user_name');
        }
      } catch (err) {
        console.error('Token validation failed:', err);
      }
      setValidating(false);
    };

    validateToken();
  }, [tutorialDone]);

  const nav = (s, courseId) => {
    if (courseId) setActiveCourse(courseId);
    if (s === 'login') {
      setRole('alumno');
      localStorage.removeItem('ind_auth_token');
      localStorage.removeItem('ind_user_role');
      localStorage.removeItem('ind_user_name');
    }
    setScreen(s);
  };

  const handleLogin = (detectedRole) => {
    setRole(detectedRole);
    if (detectedRole === 'admin') {
      setScreen('admin');
    } else if (!tutorialDone) {
      setScreen('tutorial');
    } else {
      setScreen('dashboard');
    }
  };

  const handleTutorialDone = () => {
    localStorage.setItem('ind_tutorial_seen', '1');
    setTutorialDone(true);
    setScreen('dashboard');
  };

  // Validate role for admin screens
  const isAdminScreen = screen?.startsWith('admin') || screen === 'settings';
  if (isAdminScreen && role !== 'admin') {
    // Unauthorized access attempt - redirect to dashboard
    setScreen('dashboard');
    return <DashboardPage onNav={nav} />;
  }

  // Show loading while validating token
  if (validating) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0c0e' }}>
        <div style={{ textAlign: 'center', color: '#EDE8E2' }}>
          <div style={{ marginBottom: 20, fontSize: 18, opacity: 0.8 }}>Validando sesión...</div>
        </div>
      </div>
    );
  }

  // Screens without sidebar
  if (screen === 'login')    return <LoginPage onLogin={handleLogin} />;
  if (screen === 'tutorial') return <TutorialPage onDone={handleTutorialDone} />;

  const renderMain = () => {
    switch (screen) {
      case 'dashboard':        return <DashboardPage onNav={nav} />;
      case 'course':           return <CoursePage courseStyle={courseStyle} onStyleChange={s => { setCourseStyle(s); localStorage.setItem(COURSE_STYLE_KEY, s); }} onNav={nav} activeCourse={activeCourse} />;
      case 'quiz':             return <QuizPage onNav={nav} activeCourse={activeCourse} />;
      case 'certificate':      return <CertificatePage />;
      case 'admin_content':    return <ContentPage onNav={nav} />;
      case 'admin':
      case 'admin_users':
      case 'admin_email':
      case 'admin_questions':
      case 'settings':         return <AdminPage screen={screen} onNav={nav} />;
      default:                 return <DashboardPage onNav={nav} />;
    }
  };

  return (
    <Shell screen={screen} onNav={nav} role={role}>
      <div className="fadein" key={screen} style={{ flex: 1 }}>
        {renderMain()}
      </div>
    </Shell>
  );
}
