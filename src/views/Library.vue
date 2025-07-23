<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
    <div class="navbar bg-base-200">
      <div class="navbar-start">
        <router-link to="/" class="text-xl font-bold">🧪 Component Forge</router-link>
      </div>
      <div class="navbar-center">
        <h1 class="text-lg font-semibold">DaisyUI Component Library</h1>
      </div>
      <div class="navbar-end">
        <ThemeSelector />
      </div>
    </div>

    <!-- Library Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Section -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">🎨 DaisyUI Component Library</h2>
          <p class="text-lg text-base-content/70 max-w-3xl mx-auto">
            Production-ready components and templates built with DaisyUI and Tailwind CSS. 
            Each component is crafted with accessibility, responsiveness, and customization in mind.
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div class="tabs tabs-bordered tabs-lg justify-center mb-8">
          <button 
            class="tab"
            :class="{ 'tab-active': activeTab === 'components' }"
            @click="activeTab = 'components'"
          >
            Components
          </button>
          <button 
            class="tab"
            :class="{ 'tab-active': activeTab === 'templates' }"
            @click="activeTab = 'templates'"
          >
            Dashboard Templates
          </button>
          <button 
            class="tab"
            :class="{ 'tab-active': activeTab === 'presets' }"
            @click="activeTab = 'presets'"
          >
            Button Presets
          </button>
          <button 
            class="tab"
            :class="{ 'tab-active': activeTab === 'themes' }"
            @click="activeTab = 'themes'"
          >
            Theme Showcase
          </button>
        </div>

        <!-- Components Tab -->
        <div v-if="activeTab === 'components'" class="space-y-12">
          <!-- Buttons Section -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Buttons</h3>
              <p class="text-base-content/70">Various button styles and variations</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Standard Buttons -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Standard Buttons</h4>
                  <div class="space-y-2">
                    <button class="btn btn-primary btn-sm w-full">Primary</button>
                    <button class="btn btn-secondary btn-sm w-full">Secondary</button>
                    <button class="btn btn-accent btn-sm w-full">Accent</button>
                    <button class="btn btn-neutral btn-sm w-full">Neutral</button>
                  </div>
                </div>
              </div>

              <!-- Size Variations -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Size Variations</h4>
                  <div class="space-y-2">
                    <button class="btn btn-xs btn-primary w-full">Extra Small</button>
                    <button class="btn btn-sm btn-primary w-full">Small</button>
                    <button class="btn btn-primary w-full">Normal</button>
                    <button class="btn btn-lg btn-primary w-full">Large</button>
                  </div>
                </div>
              </div>

              <!-- Enhanced Buttons -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Enhanced Buttons</h4>
                  <div class="space-y-2">
                    <button class="btn btn-primary btn-apex-glow btn-sm w-full">Apex Glow</button>
                    <button class="btn btn-secondary hover:scale-105 transition-transform btn-sm w-full">Hover Scale</button>
                    <button class="btn btn-accent animate-pulse btn-sm w-full">Pulsing</button>
                    <button class="btn btn-primary glass btn-sm w-full">Glass Effect</button>
                  </div>
                </div>
              </div>

              <!-- Button States -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Button States</h4>
                  <div class="space-y-2">
                    <button class="btn btn-success btn-sm w-full">Success</button>
                    <button class="btn btn-warning btn-sm w-full">Warning</button>
                    <button class="btn btn-error btn-sm w-full">Error</button>
                    <button class="btn btn-info btn-sm w-full">Info</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Form Controls Section -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Form Controls</h3>
              <p class="text-base-content/70">Input fields, selects, and form elements</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Text Inputs -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Text Inputs</h4>
                  <div class="space-y-3">
                    <input type="text" placeholder="Default input" class="input input-bordered w-full" />
                    <input type="text" placeholder="Primary input" class="input input-bordered input-primary w-full" />
                    <input type="email" placeholder="Email input" class="input input-bordered input-secondary w-full" />
                    <input type="password" placeholder="Password" class="input input-bordered input-accent w-full" />
                  </div>
                </div>
              </div>

              <!-- Select Dropdowns -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Select Dropdowns</h4>
                  <div class="space-y-3">
                    <select class="select select-bordered w-full">
                      <option disabled selected>Default select</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                    <select class="select select-bordered select-primary w-full">
                      <option disabled selected>Primary select</option>
                      <option>Option A</option>
                      <option>Option B</option>
                    </select>
                    <select class="select select-bordered select-secondary w-full">
                      <option disabled selected>Secondary select</option>
                      <option>Choice 1</option>
                      <option>Choice 2</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Checkboxes & Radio -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Checkboxes & Radio</h4>
                  <div class="space-y-3">
                    <div class="form-control">
                      <label class="cursor-pointer label justify-start gap-2">
                        <input type="checkbox" checked class="checkbox checkbox-primary" />
                        <span class="label-text">Primary checkbox</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="cursor-pointer label justify-start gap-2">
                        <input type="radio" name="radio-example" class="radio radio-secondary" checked />
                        <span class="label-text">Secondary radio</span>
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="cursor-pointer label justify-start gap-2">
                        <input type="radio" name="radio-example" class="radio radio-accent" />
                        <span class="label-text">Accent radio</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Cards Section -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Cards</h3>
              <p class="text-base-content/70">Different card layouts and styles</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Standard Card -->
              <div class="card bg-base-100 shadow-xl">
                <div class="card-body p-4">
                  <h4 class="card-title text-base">Standard Card</h4>
                  <p class="text-sm text-base-content/70">Basic card with shadow and content area.</p>
                  <div class="card-actions justify-end">
                    <button class="btn btn-primary btn-xs">Action</button>
                  </div>
                </div>
              </div>

              <!-- Tournament Card -->
              <div class="card card-tournament shadow-xl">
                <div class="card-body p-4">
                  <h4 class="card-title text-base">Tournament Card</h4>
                  <p class="text-sm text-base-content/70">Enhanced card with backdrop blur effect.</p>
                  <div class="card-actions justify-end">
                    <button class="btn btn-secondary btn-xs">View</button>
                  </div>
                </div>
              </div>

              <!-- Image Card -->
              <div class="card bg-base-100 shadow-xl">
                <figure class="bg-gradient-to-r from-primary to-secondary h-24"></figure>
                <div class="card-body p-4">
                  <h4 class="card-title text-base">Image Card</h4>
                  <p class="text-sm text-base-content/70">Card with image header area.</p>
                  <div class="card-actions justify-end">
                    <button class="btn btn-accent btn-xs">Learn More</button>
                  </div>
                </div>
              </div>

              <!-- Stats Card -->
              <div class="card bg-base-200 shadow-xl">
                <div class="card-body p-4 text-center">
                  <div class="stat-value text-primary text-2xl">89%</div>
                  <div class="stat-title text-sm">Completion</div>
                  <div class="stat-desc text-xs text-success">↗️ 12% increase</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Navigation Components -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Navigation</h3>
              <p class="text-base-content/70">Navigation bars, breadcrumbs, and menus</p>
            </div>
            
            <div class="grid grid-cols-1 gap-6">
              <!-- Navbar Example -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title mb-4">Navigation Bar</h4>
                  <div class="navbar bg-base-100 rounded-lg">
                    <div class="navbar-start">
                      <div class="dropdown">
                        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                      </div>
                      <a class="btn btn-ghost text-xl">Brand</a>
                    </div>
                    <div class="navbar-center hidden lg:flex">
                      <ul class="menu menu-horizontal px-1">
                        <li><a>Home</a></li>
                        <li><a>About</a></li>
                        <li><a>Services</a></li>
                      </ul>
                    </div>
                    <div class="navbar-end">
                      <a class="btn btn-primary btn-sm">Get Started</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Breadcrumbs -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title mb-4">Breadcrumbs</h4>
                  <div class="text-sm breadcrumbs">
                    <ul>
                      <li><a>Home</a></li>
                      <li><a>Components</a></li>
                      <li>Navigation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title mb-4">Tab Navigation</h4>
                  <div class="tabs tabs-bordered">
                    <a class="tab tab-active">Tab 1</a>
                    <a class="tab">Tab 2</a>
                    <a class="tab">Tab 3</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Data Display Section -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Data Display</h3>
              <p class="text-base-content/70">Tables, badges, and data visualization components</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Badges -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Badges & Indicators</h4>
                  <div class="space-y-4">
                    <div class="flex flex-wrap gap-2">
                      <span class="badge badge-primary">Primary</span>
                      <span class="badge badge-secondary">Secondary</span>
                      <span class="badge badge-accent">Accent</span>
                      <span class="badge badge-neutral">Neutral</span>
                    </div>
                    <div class="flex flex-wrap gap-2 items-center">
                      <span class="badge badge-xs badge-info">XS</span>
                      <span class="badge badge-sm badge-success">SM</span>
                      <span class="badge badge-md badge-warning">MD</span>
                      <span class="badge badge-lg badge-error">LG</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress & Loading -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Progress & Loading</h4>
                  <div class="space-y-4">
                    <progress class="progress progress-primary w-full" value="32" max="100"></progress>
                    <progress class="progress progress-secondary w-full" value="70" max="100"></progress>
                    <progress class="progress progress-accent w-full" value="45" max="100"></progress>
                    <div class="flex items-center gap-2">
                      <span class="loading loading-spinner loading-sm"></span>
                      <span class="loading loading-dots loading-sm"></span>
                      <span class="loading loading-ring loading-sm"></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Table -->
              <div class="card bg-base-200 md:col-span-2">
                <div class="card-body">
                  <h4 class="card-title">Data Table</h4>
                  <div class="overflow-x-auto">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>John Doe</td>
                          <td><span class="badge badge-success badge-sm">Active</span></td>
                          <td>Developer</td>
                          <td><button class="btn btn-ghost btn-xs">Edit</button></td>
                        </tr>
                        <tr>
                          <td>Jane Smith</td>
                          <td><span class="badge badge-warning badge-sm">Pending</span></td>
                          <td>Designer</td>
                          <td><button class="btn btn-ghost btn-xs">Edit</button></td>
                        </tr>
                        <tr>
                          <td>Bob Johnson</td>
                          <td><span class="badge badge-error badge-sm">Inactive</span></td>
                          <td>Manager</td>
                          <td><button class="btn btn-ghost btn-xs">Edit</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Modal & Overlays -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-3xl font-bold mb-2">Modals & Overlays</h3>
              <p class="text-base-content/70">Dialog boxes, alerts, and overlay components</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Alert Examples -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Alerts</h4>
                  <div class="space-y-3">
                    <div class="alert alert-info">
                      <Icon name="sun" class="w-4 h-4" />
                      <span class="text-sm">Info alert message</span>
                    </div>
                    <div class="alert alert-success">
                      <Icon name="sun" class="w-4 h-4" />
                      <span class="text-sm">Success alert message</span>
                    </div>
                    <div class="alert alert-warning">
                      <Icon name="sun" class="w-4 h-4" />
                      <span class="text-sm">Warning alert message</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Trigger -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Modal Dialog</h4>
                  <p class="text-sm text-base-content/70 mb-4">Click to open modal dialog</p>
                  <button class="btn btn-primary btn-sm" onclick="modal_demo.showModal()">Open Modal</button>
                </div>
              </div>

              <!-- Tooltip Examples -->
              <div class="card bg-base-200">
                <div class="card-body">
                  <h4 class="card-title">Tooltips</h4>
                  <div class="space-y-3">
                    <div class="tooltip tooltip-top" data-tip="Top tooltip">
                      <button class="btn btn-sm">Top</button>
                    </div>
                    <div class="tooltip tooltip-right" data-tip="Right tooltip">
                      <button class="btn btn-sm">Right</button>
                    </div>
                    <div class="tooltip tooltip-bottom" data-tip="Bottom tooltip">
                      <button class="btn btn-sm">Bottom</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Dashboard Templates Tab -->
        <div v-else-if="activeTab === 'templates'" class="space-y-12">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold mb-4">🏗️ Dashboard Templates</h3>
            <p class="text-base-content/70 max-w-3xl mx-auto">
              Complete dashboard layouts and patterns for rapid application development. 
              Each template includes responsive design and interactive components.
            </p>
          </div>

          <!-- KPI Dashboard -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-2">KPI Dashboard Layout</h3>
              <p class="text-base-content/70">Analytics dashboard with key performance indicators</p>
            </div>
            
            <div class="card bg-base-100 shadow-xl border-2 border-primary/20">
              <div class="card-body p-6">
                <!-- Dashboard Header -->
                <div class="flex justify-between items-center mb-6">
                  <h4 class="text-xl font-bold">Analytics Dashboard</h4>
                  <div class="flex gap-2">
                    <select class="select select-bordered select-sm">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                    <button class="btn btn-primary btn-sm">Export</button>
                  </div>
                </div>

                <!-- KPI Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div class="stat bg-base-200 rounded-lg p-4">
                    <div class="stat-figure text-primary">
                      <Icon name="sun" class="w-8 h-8" />
                    </div>
                    <div class="stat-title text-sm">Total Users</div>
                    <div class="stat-value text-xl text-primary">31K</div>
                    <div class="stat-desc text-success">↗︎ 400 (22%)</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg p-4">
                    <div class="stat-figure text-secondary">
                      <Icon name="moon" class="w-8 h-8" />
                    </div>
                    <div class="stat-title text-sm">Revenue</div>
                    <div class="stat-value text-xl text-secondary">$89K</div>
                    <div class="stat-desc text-success">↗︎ 12% growth</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg p-4">
                    <div class="stat-figure text-accent">
                      <Icon name="gaming" class="w-8 h-8" />
                    </div>
                    <div class="stat-title text-sm">Sessions</div>
                    <div class="stat-value text-xl text-accent">1.2M</div>
                    <div class="stat-desc">↘︎ 3% decrease</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg p-4">
                    <div class="stat-figure">
                      <Icon name="palette" class="w-8 h-8" />
                    </div>
                    <div class="stat-title text-sm">Conversion</div>
                    <div class="stat-value text-xl">4.7%</div>
                    <div class="stat-desc text-success">↗︎ 0.5% increase</div>
                  </div>
                </div>

                <!-- Chart Placeholders -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="card bg-base-200">
                    <div class="card-body">
                      <h5 class="card-title text-lg">Traffic Sources</h5>
                      <div class="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        <div class="text-center">
                          <Icon name="sun" class="w-12 h-12 mx-auto mb-2" />
                          <p class="text-sm">Chart Placeholder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card bg-base-200">
                    <div class="card-body">
                      <h5 class="card-title text-lg">User Activity</h5>
                      <div class="h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                        <div class="text-center">
                          <Icon name="gaming" class="w-12 h-12 mx-auto mb-2" />
                          <p class="text-sm">Chart Placeholder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Template Features -->
          <section class="space-y-6">
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-2">Template Features</h3>
              <p class="text-base-content/70">What makes these dashboard templates special</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="card bg-base-200">
                <div class="card-body text-center">
                  <div class="text-3xl mb-2">📱</div>
                  <h4 class="font-semibold">Responsive Design</h4>
                  <p class="text-sm text-base-content/70">Mobile-first approach with adaptive layouts</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center">
                  <div class="text-3xl mb-2">⚡</div>
                  <h4 class="font-semibold">Real-time Data</h4>
                  <p class="text-sm text-base-content/70">Live updates and interactive components</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center">
                  <div class="text-3xl mb-2">🎨</div>
                  <h4 class="font-semibold">Customizable</h4>
                  <p class="text-sm text-base-content/70">Easy theming with DaisyUI color system</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center">
                  <div class="text-3xl mb-2">🚀</div>
                  <h4 class="font-semibold">Production Ready</h4>
                  <p class="text-sm text-base-content/70">Optimized for performance and accessibility</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Button Presets Tab -->
        <div v-else-if="activeTab === 'presets'" class="space-y-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold mb-4">Button Presets</h3>
            <p class="text-base-content/70">Pre-configured button styles ready to use</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Standard DaisyUI -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Standard DaisyUI</h4>
                <button class="btn btn-primary w-full mb-2">Primary Button</button>
                <p class="text-sm text-base-content/70">Clean, minimal button style</p>
              </div>
            </div>

            <!-- Enhanced Tailwind -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Enhanced Tailwind</h4>
                <button class="btn btn-primary hover:scale-105 transition-transform w-full mb-2">Enhanced Button</button>
                <p class="text-sm text-base-content/70">With hover effects and smooth transitions</p>
              </div>
            </div>

            <!-- Apex Glow -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Apex Glow</h4>
                <button class="btn btn-primary btn-apex-glow w-full mb-2">Glow Button</button>
                <p class="text-sm text-base-content/70">Custom glow effect with Apex branding</p>
              </div>
            </div>

            <!-- Cyberpunk -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Cyberpunk</h4>
                <button class="btn bg-cyan-500 hover:bg-cyan-400 text-black font-bold border-2 border-cyan-300 hover:border-cyan-200 w-full mb-2">Cyber Button</button>
                <p class="text-sm text-base-content/70">Futuristic cyberpunk aesthetic</p>
              </div>
            </div>

            <!-- Glassmorphism -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Glassmorphism</h4>
                <button class="btn glass hover:glass border-white/20 w-full mb-2">Glass Button</button>
                <p class="text-sm text-base-content/70">Modern glass effect with transparency</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Showcase Tab -->
        <div v-else-if="activeTab === 'themes'" class="space-y-8">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold mb-4">Theme Showcase</h3>
            <p class="text-base-content/70">See how components look across different DaisyUI themes</p>
          </div>

          <div class="alert alert-info">
            <Icon name="palette" class="w-6 h-6" />
            <span>Use the theme selector in the header to test different themes with these components!</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Sample Component Showcase -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Button Showcase</h4>
                <div class="space-y-2">
                  <button class="btn btn-primary btn-sm w-full">Primary</button>
                  <button class="btn btn-secondary btn-sm w-full">Secondary</button>
                  <button class="btn btn-accent btn-sm w-full">Accent</button>
                </div>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Badge Showcase</h4>
                <div class="flex flex-wrap gap-1">
                  <span class="badge badge-primary badge-sm">Primary</span>
                  <span class="badge badge-secondary badge-sm">Secondary</span>
                  <span class="badge badge-accent badge-sm">Accent</span>
                  <span class="badge badge-neutral badge-sm">Neutral</span>
                </div>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h4 class="card-title">Progress Showcase</h4>
                <div class="space-y-2">
                  <progress class="progress progress-primary w-full" value="70" max="100"></progress>
                  <progress class="progress progress-secondary w-full" value="50" max="100"></progress>
                  <progress class="progress progress-accent w-full" value="30" max="100"></progress>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Implementation -->
        <dialog id="modal_demo" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Modal Title</h3>
            <p class="py-4">This is a sample modal dialog with DaisyUI styling.</p>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn btn-primary">Close</button>
              </form>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <!-- Footer -->
        <div class="text-center mt-16 pt-8 border-t border-base-content/10">
          <p class="text-base-content/60">
            Want to test and customize these components? Visit the 
            <router-link to="/lab" class="link link-primary">Testing Laboratory</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSelector, Icon } from 'component-forge'

const activeTab = ref<'components' | 'templates' | 'presets' | 'themes'>('components')
</script>

<style scoped>
.badge-apex-pulse {
  animation: apex-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes apex-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
</style>