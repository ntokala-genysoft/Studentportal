import { NavLink } from 'react-router-dom';
import { PiGraduationCap } from 'react-icons/pi';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaBookBookmark } from 'react-icons/fa6';
import { MdOutlineLaptopChromebook } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="flex items-center mb-10">
        <PiGraduationCap className="text-4xl mr-2" />
        <span className="text-3xl font-[Dancing Script, cursive]">EduNexa</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 
            isActive 
              ? 'sidebar-link sidebar-link-active' 
              : 'sidebar-link'
          }
        >
          <div className="link-content">
            <LuLayoutDashboard className="link-icon" />
            <span>Dashboard</span>
          </div>
        </NavLink>
        <NavLink
          to="/subjects"
          className={({ isActive }) => 
            isActive 
              ? 'sidebar-link sidebar-link-active' 
              : 'sidebar-link'
          }
        >
          <div className="link-content">
            <FaBookBookmark className="link-icon" />
            <span>Subjects</span>
          </div>
        </NavLink>
        <NavLink
          to="/assessments"
          className={({ isActive }) => 
            isActive 
              ? 'sidebar-link sidebar-link-active' 
              : 'sidebar-link'
          }
        >
          <div className="link-content">
            <MdOutlineLaptopChromebook className="link-icon" />
            <span>Assessment</span>
          </div>
        </NavLink>
        <NavLink
          to="/score-card"
          className={({ isActive }) => 
            isActive 
              ? 'sidebar-link sidebar-link-active' 
              : 'sidebar-link'
          }
        >
          <div className="link-content">
            <FaTrophy className="link-icon" />
            <span>Score Card</span>
          </div>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;