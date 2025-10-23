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
	}

	let { embedUrl, position, primaryColor, agentName, isOpen = $bindable(false) }: Props = $props();

	console.log('🎨 Widget received individual props:', {
		embedUrl,
		position,
		primaryColor,
		agentName,
		isOpen
	});

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

<!-- Widget Button -->
<div class="fixed {position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-50">
	<button
		onclick={toggleWidget}
		class="rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:opacity-90 transition"
		style="background-color: {primaryColor}"
	>
		<span class="text-white text-2xl">💬</span>
	</button>
</div>

<!-- Widget Dialog (when open) -->
{#if isOpen}
	<div class="fixed bottom-20 {position === 'bottom-right' ? 'right-4' : 'left-4'} z-50">
		<div class="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col">
			<!-- Header -->
			<div class="bg-gray-100 p-4 rounded-t-lg flex justify-between items-center border-b">
				<h3 class="font-semibold text-gray-800">{agentName}</h3>
				<button onclick={toggleWidget} class="text-gray-600 hover:text-gray-800">✕</button>
			</div>

			<!-- iframe Content -->
			<div class="flex-1 overflow-hidden">
				<iframe src={embedUrl} class="w-full h-full border-0" title="Virtual Agent Chat"></iframe>
			</div>
		</div>
	</div>
{/if}
