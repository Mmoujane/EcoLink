'use client'

import React, { useRef, useState } from 'react';
 
 const ReportForm: React.FC = () => {

   const fileInputRef = useRef<HTMLInputElement>(null);

   return (
    <div className="max-w-4xl mx-auto">
        <form id="report-form" className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address to Report *
                                </label>
                                <input 
                                    type="text" 
                                    id="reported-address"
                                    placeholder="0x1234...5678 or user ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter wallet address or user identifier</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Violation Type *
                                </label>
                                <select id="violation-type" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm" required>
                                    <option value="">Select violation type</option>
                                    <option value="fake-submission">🎭 Fake Submission</option>
                                    <option value="duplicate-claim">📋 Duplicate Claim</option>
                                    <option value="false-verification">❌ False Verification</option>
                                    <option value="spam-activity">📧 Spam Activity</option>
                                    <option value="manipulation">🎯 Vote Manipulation</option>
                                    <option value="impersonation">👤 Impersonation</option>
                                    <option value="other">⚠️ Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea 
                                    id="report-description"
                                    rows={4}
                                    placeholder="Provide detailed description of the violation..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
                                    required
                                ></textarea>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Be specific and factual</span>
                                    <span id="char-count">0/500</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attach Proof
                                </label>
                                <div onClick={() => fileInputRef.current && fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                                    <p className="text-xs text-gray-500">Screenshots, documents, or links as evidence</p>
                                    <input ref={fileInputRef} type="file" id="evidence-upload" className="hidden" multiple accept="image/*,.pdf,.txt" />
                                    <button type="button" className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium">
                                        Choose Files
                                    </button>
                                </div>
                                <div id="uploaded-files" className="mt-3 space-y-2"></div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Links
                                </label>
                                <input 
                                    type="url" 
                                    id="evidence-links"
                                    placeholder="https://example.com/evidence"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Links to external evidence or documentation</p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            False reports may result in penalties. Ensure your evidence is accurate and verifiable.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <span className="mr-2">🚨</span>
                                Submit Report
                            </button>
                        </form>
    </div>
   );
 }
 
 export default ReportForm;
              
              
              
              