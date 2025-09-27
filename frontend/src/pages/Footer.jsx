"use client";

import React from "react";
import { useNavigate, Link } from "react-router-dom";

const socialLinks = {
  facebook: "https://facebook.com/panhalahomestay",
  instagram: "https://instagram.com/panhalahomestay",
  whatsapp: "https://wa.me/919876543210", // example number
};

const FacebookIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.337v21.326C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116c.725 0 1.325-.6 1.325-1.337V1.337C24 .6 23.4 0 22.675 0z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5a3.75 3.75 0 003.75-3.75v-8.5A3.75 3.75 0 0016.25 4h-8.5zm8.75 1.5a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 0 5.373 0 12a11.94 11.94 0 001.64 6.01L0 24l6.12-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52zm-8.52 17.4a8.4 8.4 0 01-4.4-1.3l-.3-.18-3.1.8.83-3.02-.2-.3a8.4 8.4 0 1110.9 3.9zm4.7-6.3c-.25-.12-1.48-.73-1.7-.82-.22-.1-.38-.12-.54.12s-.62.82-.76.98c-.14.16-.28.18-.52.06a6.3 6.3 0 01-1.85-1.14 7.1 7.1 0 01-1.3-1.6c-.14-.25 0-.38.1-.5.1-.1.22-.28.33-.42.1-.14.14-.25.22-.4.07-.14 0-.27-.02-.38-.04-.12-.54-1.3-.74-1.8-.2-.48-.4-.42-.54-.43-.14 0-.3 0-.46 0-.16 0-.4.06-.6.3s-.8.78-.8 1.9c0 1.12.82 2.2.94 2.36.12.16 1.62 2.5 3.92 3.5a6.9 6.9 0 001.76.7c.74.1 1.42.08 1.96.05.6-.03 1.48-.6 1.7-1.18.22-.58.22-1.08.15-1.18-.07-.1-.25-.16-.5-.28z" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-green-900 text-white pt-12 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-4 text-green-100">
            Karpewadi Homestay
          </h3>
          <p className="text-green-200 text-sm leading-relaxed mb-4">
            Experience the serene village lifestyle with cozy homestay rooms and
            traditional local food for trekkers exploring the natural beauty of
            Maharashtra.
          </p>
          <div className="flex space-x-4">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-green-200 hover:text-white transition-colors rounded-full bg-green-800 p-2"
            >
              <FacebookIcon />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-green-200 hover:text-white transition-colors rounded-full bg-green-800 p-2"
            >
              <InstagramIcon />
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-green-200 hover:text-white transition-colors rounded-full bg-green-800 p-2"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Quick Links - Two Columns */}
        <div className="md:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-green-100">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Rooms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Book Now
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-green-100">
            Contact Info
          </h3>
          <div className="space-y-3 text-sm grid grid-col-2 text-center gap-2">
            <div className="flex items-start">
              <MapPinIcon className="mt-0.5 mr-3 flex-shrink-0 text-green-300" />
              <span className="text-green-200">
                Karpewadi, Shahuwadi
                <br />
                Maharashtra 416215
              </span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="mr-3 flex-shrink-0 text-green-300" />
              <a
                href="tel:+919876543210"
                className="text-green-200 hover:text-white transition-colors"
              >
                +91 93218 03014
              </a>
            </div>
            <div className="flex items-center">
              <MailIcon className="mr-3 flex-shrink-0 text-green-300" />
              <a
                href="mailto:surajkadam706004@gmail.com"
                className="text-green-200 hover:text-white transition-colors"
              >
                surajkadam1706004@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-green-800 pt-6 text-center text-sm text-green-300">
        <p>
          © {new Date().getFullYear()} Karpewadi Homestay. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-6 text-xs">
          <Link
            to="/shipping-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
