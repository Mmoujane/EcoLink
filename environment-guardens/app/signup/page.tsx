'use client'

import Image from "next/image";
import React, {use, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';

const HashConnectClient = dynamic(() => import('@/app/components/register'), { ssr: false });


export default function SignUp() {
  return (
    <div>
        <HashConnectClient />
    </div>
  );
}
