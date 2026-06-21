'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { X, ZoomIn } from 'lucide-react';

interface ImageItem {
	src: string;
	ratio: number;
	alt: string;
}


export function ImageGallery() {
	const galleryImages: ImageItem[] = [
		{ src: "/images/events/iasf-gallery/IMG_0752.HEIC.jpg", ratio: 4 / 3, alt: "IASF Showcase Interaction" },
		{ src: "/images/events/iasf-gallery/IMG_0753.HEIC.jpg", ratio: 3 / 4, alt: "EWB HITAM Display Board" },
		{ src: "/images/events/iasf-gallery/IMG_0754.HEIC.jpg", ratio: 16 / 9, alt: "Project Demo in Action" },
		{ src: "/images/events/iasf-gallery/IMG_0755.HEIC.jpg", ratio: 4 / 3, alt: "Delegates Reviewing Projects" },
		{ src: "/images/events/iasf-gallery/IMG_0756.HEIC.jpg", ratio: 3 / 4, alt: "Students Team Photo" },
		{ src: "/images/events/iasf-gallery/IMG_0757.HEIC.jpg", ratio: 16 / 9, alt: "Engineering Presentation" },
		{ src: "/images/events/iasf-gallery/IMG_0758.HEIC.jpg", ratio: 4 / 3, alt: "Mentorship Discussions" },
		{ src: "/images/events/iasf-gallery/IMG_0762.HEIC.jpg", ratio: 3 / 4, alt: "Project Showcase Setup" },
		{ src: "/images/events/iasf-gallery/IMG_0772.HEIC.jpg", ratio: 16 / 9, alt: "Team Pitching to Mentors" },
		{ src: "/images/events/iasf-gallery/IMG_0773.HEIC.jpg", ratio: 4 / 3, alt: "Annual Forum Gathering" },
		{ src: "/images/events/iasf-gallery/IMG_0774.HEIC.jpg", ratio: 3 / 4, alt: "Prototype Hardware Inspection" },
		{ src: "/images/events/iasf-gallery/IMG_0775.HEIC.jpg", ratio: 16 / 9, alt: "Mentors Feedback Session" },
		{ src: "/images/events/iasf-gallery/IMG_0776.HEIC.jpg", ratio: 4 / 3, alt: "EWB Team Presentation" },
		{ src: "/images/events/iasf-gallery/IMG_0777.HEIC.jpg", ratio: 3 / 4, alt: "Interactive QA Session" },
		{ src: "/images/events/iasf-gallery/IMG_0778.HEIC.jpg", ratio: 16 / 9, alt: "Delegates Group Discussion" },
		{ src: "/images/events/iasf-gallery/IMG_0779.HEIC.jpg", ratio: 4 / 3, alt: "Project Review Panel" },
		{ src: "/images/events/iasf-gallery/IMG_0780.HEIC.jpg", ratio: 3 / 4, alt: "Student Chapter Representatives" },
		{ src: "/images/events/iasf-gallery/IMG_0781.HEIC.jpg", ratio: 16 / 9, alt: "Technical Session Discussion" },
		{ src: "/images/events/iasf-gallery/IMG_0782.HEIC.jpg", ratio: 4 / 3, alt: "Project Expo Highlights" },
		{ src: "/images/events/iasf-gallery/IMG_0783.HEIC.jpg", ratio: 3 / 4, alt: "Hardware Demonstration" },
		{ src: "/images/events/iasf-gallery/IMG_0785.HEIC.jpg", ratio: 16 / 9, alt: "Student Engagement Forum" },
		{ src: "/images/events/iasf-gallery/IMG_0786.HEIC.jpg", ratio: 4 / 3, alt: "Innovative Models Display" },
		{ src: "/images/events/iasf-gallery/IMG_0787.HEIC.jpg", ratio: 3 / 4, alt: "Audience Interaction" },
		{ src: "/images/events/iasf-gallery/IMG_0788.HEIC.jpg", ratio: 16 / 9, alt: "Mentorship Advice Session" },
		{ src: "/images/events/iasf-gallery/IMG_0789.HEIC.jpg", ratio: 4 / 3, alt: "Showcase Pitch Deck" },
		{ src: "/images/events/iasf-gallery/IMG_0790.HEIC.jpg", ratio: 3 / 4, alt: "Chapter Officers and Mentors" },
		{ src: "/images/events/iasf-gallery/IMG_0793.JPG", ratio: 16 / 9, alt: "IASF Presentation" },
		{ src: "/images/events/iasf-gallery/IMG_0794.JPG", ratio: 4 / 3, alt: "EWB HITAM Team" },
		{ src: "/images/events/iasf-gallery/IMG_0795.JPG", ratio: 3 / 4, alt: "IASF Project Pitch" },
		{ src: "/images/events/iasf-gallery/IMG_0797.HEIC.jpg", ratio: 16 / 9, alt: "Presentation Slide Highlights" },
		{ src: "/images/events/iasf-gallery/IMG_0798.HEIC.jpg", ratio: 4 / 3, alt: "Evaluation & Grading" },
		{ src: "/images/events/iasf-gallery/IMG_0799.HEIC.jpg", ratio: 3 / 4, alt: "Prototype Functional Demo" },
		{ src: "/images/events/iasf-gallery/IMG_0800.HEIC.jpg", ratio: 16 / 9, alt: "EWB HITAM Chapter Showcase" },
		{ src: "/images/events/iasf-gallery/IMG_0801.HEIC.jpg", ratio: 4 / 3, alt: "Annual Forum Student Showcase" },
		{ src: "/images/events/iasf-gallery/IMG_0802.HEIC.jpg", ratio: 3 / 4, alt: "Delegates Group Interaction" },
		{ src: "/images/events/iasf-gallery/IMG_0803.HEIC.jpg", ratio: 16 / 9, alt: "Project Feedback Forum" },
		{ src: "/images/events/iasf-gallery/IMG_0809.HEIC.jpg", ratio: 4 / 3, alt: "EWB Student Presentations" },
		{ src: "/images/events/iasf-gallery/IMG_0810.HEIC.jpg", ratio: 3 / 4, alt: "Forum Judges and Mentors" },
		{ src: "/images/events/iasf-gallery/IMG_0811.HEIC.jpg", ratio: 16 / 9, alt: "Technical Mentorship Round" },
		{ src: "/images/events/iasf-gallery/IMG_0820.HEIC.jpg", ratio: 4 / 3, alt: "EWB Community Project Showcase" },
		{ src: "/images/events/iasf-gallery/IMG_0821.HEIC.jpg", ratio: 3 / 4, alt: "Student Engagement and Networking" },
		{ src: "/images/events/iasf-gallery/IMG_0823.JPG", ratio: 16 / 9, alt: "IASF Interaction Session" },
		{ src: "/images/events/iasf-gallery/IMG_0826.HEIC.jpg", ratio: 4 / 3, alt: "Awards and Recognition Ceremony" },
		{ src: "/images/events/iasf-gallery/IMG_0827.HEIC.jpg", ratio: 3 / 4, alt: "Closing Remarks and Group Photo" }
	];

	const [activeLightboxImage, setActiveLightboxImage] = React.useState<ImageItem | null>(null);

	return (
		<div className="relative flex w-full flex-col items-center justify-center py-10 px-4">
			{/* True CSS Columns Masonry Grid (Prevents Cropping, Respects Original Resolution) */}
			<div className="mx-auto w-full max-w-6xl columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
				{galleryImages.map((img, index) => {
					const thumbnailSrc = `/_next/image?url=${encodeURIComponent(img.src)}&w=640&q=75`;

					return (
						<div 
							key={index} 
							onClick={() => setActiveLightboxImage(img)}
							className="break-inside-avoid mb-6 group cursor-pointer overflow-hidden rounded-lg"
						>
							<AnimatedImage
								alt={img.alt}
								src={thumbnailSrc}
							/>
						</div>
					);
				})}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{activeLightboxImage && (
					<LightboxModal 
						image={activeLightboxImage} 
						onClose={() => setActiveLightboxImage(null)} 
					/>
				)}
			</AnimatePresence>
		</div>
	);
}

interface AnimatedImageProps {
	alt: string;
	src: string;
	className?: string;
}

function AnimatedImage({ alt, src }: AnimatedImageProps) {
	return (
		<div className="bg-zinc-100 dark:bg-zinc-900 relative rounded-lg border overflow-hidden dark:border-white/10 shadow-sm transition-all duration-300">
			{/* Hover overlay effects */}
			<div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
				<div className="bg-white/10 border border-white/20 p-3 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
					<ZoomIn size={20} />
				</div>
			</div>
			
			<img
				alt={alt}
				src={src}
				className="w-full h-auto block object-contain transition-all duration-700 ease-in-out group-hover:scale-105"
				loading="lazy"
			/>
		</div>
	);
}

interface LightboxModalProps {
	image: ImageItem;
	onClose: () => void;
}

function LightboxModal({ image, onClose }: LightboxModalProps) {
	// Close on Escape key press
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	// Prevent background scroll when open
	React.useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
			onClick={onClose}
		>
			{/* Close Button */}
			<button
				onClick={onClose}
				className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-emerald-400 transition-all border border-white/10 backdrop-blur-md cursor-pointer"
				aria-label="Close lightbox"
			>
				<X size={24} />
			</button>

			{/* Lightbox Content Container */}
			<motion.div
				initial={{ scale: 0.95, y: 10 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.95, y: 10 }}
				transition={{ type: 'spring', damping: 25, stiffness: 200 }}
				className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the content itself
			>
				<img
					src={image.src}
					alt={image.alt}
					className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
				/>
				
				{/* Image Description Footer */}
				<div className="mt-4 text-center">
					<p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
						IASF Addressal Ceremony
					</p>
				</div>
			</motion.div>
		</motion.div>
	);
}

