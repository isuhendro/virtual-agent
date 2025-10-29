<script lang="ts">
	/**
	 * Main Widget Component
	 * Placeholder for embeddable chat widget
	 */

	interface Props {
		embedUrl: string;
		position: string;
		primaryColor: string;
		agentName: string;
		isOpen?: boolean;
		fullHeight?: boolean;
		animation?: string;
	}

	let { embedUrl, position, primaryColor, agentName, isOpen = $bindable(false), fullHeight = false, animation = 'slide-right' }: Props = $props();

	let isClosing = $state(false);
	let shouldRender = $state(false);

	// Watch isOpen changes to trigger animations
	$effect(() => {
		if (isOpen) {
			isClosing = false;
			shouldRender = true;
		} else if (shouldRender) {
			// Start closing animation
			isClosing = true;
			// Remove from DOM after animation completes
			setTimeout(() => {
				shouldRender = false;
				isClosing = false;
			}, 300); // Match animation duration
		}
	});

	console.log('🎨 Widget received individual props:', {
		embedUrl,
		position,
		primaryColor,
		agentName,
		isOpen,
		fullHeight,
		animation
	});

	// Get animation class based on animation type and state
	function getAnimationClass() {
		if (animation === 'none') return '';

		if (isClosing) {
			// Closing animations
			if (animation === 'slide-left') return 'animate-slide-out-left';
			if (animation === 'slide-right') return 'animate-slide-out-right';
			if (animation === 'scale') return 'animate-scale-out';
		} else {
			// Opening animations
			if (animation === 'slide-left') return 'animate-slide-in-left';
			if (animation === 'slide-right') return 'animate-slide-in-right';
			if (animation === 'scale') return 'animate-scale-in';
		}

		return 'animate-slide-in-right'; // default
	}

	function toggleWidget() {
		isOpen = !isOpen;
	}

	function openWidget() {
		isOpen = true;
	}

	function closeWidget() {
		isOpen = false;
	}
</script>

<!-- Widget Dialog (when open or animating closed) -->
{#if shouldRender}
	<div class="fixed {fullHeight ? 'top-0 bottom-0' : 'bottom-4'} {fullHeight ? (position === 'bottom-right' ? 'right-0' : 'left-0') : (position === 'bottom-right' ? 'right-4' : 'left-4')} z-[70]">
		<div class="bg-white {fullHeight ? 'rounded-none' : 'rounded-2xl'} shadow-2xl w-[450px] {fullHeight ? 'h-full' : 'h-[700px]'} flex flex-col relative {getAnimationClass()}">
			<!-- Close Button (positioned inside for full height, protruded for regular) -->
			<button
				onclick={toggleWidget}
				class="{fullHeight ? 'absolute top-4 right-4' : 'absolute -top-4 -right-4'} z-10 bg-white hover:bg-gray-900 text-gray-900 hover:text-white text-lg font-semibold leading-none w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 cursor-pointer"
			>
				✕
			</button>

			<!-- iframe Content -->
			<div class="w-full h-full overflow-hidden {fullHeight ? '' : 'rounded-2xl'}">
				<iframe src={embedUrl} class="w-full h-full border-0" title="Virtual Agent Chat"></iframe>
			</div>
		</div>
	</div>
{/if}

<!-- Widget Button -->
<div class="fixed {position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-[60]">
	<button
		onclick={toggleWidget}
		class="flex items-center gap-2 hover:opacity-90 transition cursor-pointer rounded-full shadow-md border border-white/20 py-3 group"
		style="padding-left: 1rem; padding-right: 2.5rem; background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(240, 240, 255, 0.3)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
		aria-label="Open chat"
	>
		<svg class="w-12 h-12 flex-shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
			<g class="ldl-scale" style="transform-origin:50px 50px;transform:scale(0.8)">
				<g class="ldl-ani">
					<g class="ldl-layer">
						<g class="ldl-ani" style="transform-origin:50px 50px;transform:scale(0.97254);animation:pulse 1s linear infinite">
							<path fill="#024AD8" d="M85.889 26.091v25.576c0 6.863-6.067 12.434-12.986 12.434H38.902c-1.068 2.833-2.531 4.585-4.335 6.619.7.213 1.442-.008 2.212-.008h28.297c1.815 7.556 6.647 13.057 14.203 15.244V70.711h3.066c5.609 0 10.156-4.547 10.156-10.156V33.857c-.001-4.133-2.834-7.504-6.612-7.766z"></path>
						</g>
					</g>
					<g class="ldl-layer">
						<g class="ldl-ani" style="transform-origin:50px 50px;transform:scale(0.91);animation:pulse 1s linear infinite">
							<path fill="#024AD8" fill-opacity="0.435" d="M14.892 14.045H72.83a7.392 7.392 0 0 1 7.392 7.392v29.952c0 4.394-3.595 7.989-7.989 7.989H35.397c-1.815 6.611-7.12 11.97-13.731 14.158V59.378h-6.24c-4.36 0-7.927-3.567-7.927-7.927V21.437c.001-4.066 3.327-7.392 7.393-7.392z"></path>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<span class="text-gray-800 font-medium text-base whitespace-nowrap group-hover:underline">Need help?</span>
	</button>
</div>
