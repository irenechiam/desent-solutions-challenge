## Approach & Technical Decisions

I built this interactive furniture configurator using **Next.js, React Three Fiber, and Three.js** to create a 3D workspace where users can explore, reposition, and rotate furniture in real time. I chose React Three Fiber to integrate Three.js with React's component-based architecture, making it easier to manage 3D models, configuration state, and user interactions. I also used **Drei's `CameraControls`** for scene navigation and **Tailwind CSS** to style the interface.

### Future Improvements

With more time, I would improve collision detection using the actual dimensions of each 3D model, allowing furniture to be positioned more precisely without overlapping walls or other objects. I would also add persistent workspace configurations, refine the experience on mobile devices, and introduce more furniture and wall/floor customisation options to create a more complete rental experience.