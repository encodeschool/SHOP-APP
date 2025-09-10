import React from 'react';
import { Link } from 'react-router-dom';
import {HiChevronRight} from 'react-icons/hi';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Breadcrumb = ({ pathArray, productTitle }) => {
  const { t } = useTranslation();

  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ul className="flex flex-wrap items-center space-x-2">
        <li><Link to="/" className="hover:underline">{t("Home")}</Link></li>
        {pathArray.map((cat) => (
          <li key={cat.id} className="flex items-center space-x-2">
            <span><HiChevronRight /></span>
            <Link to={`/category/${cat.id}`} className="hover:underline">
              {cat.name}
            </Link>
          </li>
        ))}
        <li className="flex items-center space-x-2">
          <span>
            <HiChevronRight />
          </span>
          <span className="text-gray-700">{productTitle}</span>
        </li>
      </ul>
    </nav>
  );
};

export default Breadcrumb;
