import { ElementRef, ViewChild, AfterViewInit, Component, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';


type settlement = {
    center_x: number,
    center_y: number,
    tile1: Hexagon,
    tile2: Hexagon,
    tile3: Hexagon,
    is_city: boolean,
}

type player_track = {
    wood: number,
    brick: number,
    wheat: number,
    sheep: number,
    ore: number,
}


@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnDestroy {
    protected readonly title = signal('Catan-Tracker');

    @ViewChild('my_canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvas_container') container_ref!: ElementRef<HTMLDivElement>;

    public outer_tiles: Hexagon[] = [];
    public inner_tiles: Hexagon[] = [];
    public center_tile!: Hexagon;
    private ctx!: CanvasRenderingContext2D;
    private resize_observer!: ResizeObserver;
    private height!: number;
    private width!: number;


    public active_btn = signal<"resource" | "dice" | "settle" | null>(null);
    public resource_btn = signal<"wood" | "brick" | "wheat" | "sheep" | "ore" | "desert" | null>(null);
    public dice_btn = signal<"wrap-around" | "manual_select" | null>(null);
    public show_number_popup = signal(false);
    public selected_tile_for_num = signal<Hexagon | null>(null);


    ngAfterViewInit(): void {
        this.initialize_tiles();
        this.ctx = this.canvas_ref.nativeElement.getContext('2d')!;

        this.resize_observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize_canvas(width, height)
            }
        });

        this.resize_observer.observe(this.container_ref.nativeElement);
    }

    private initialize_tiles(): void {
        for (let i = 0; i < 12; i++) {
            this.outer_tiles.push(new Hexagon(0, 0, 0, "desert", -1));
        }

        for (let i = 0; i < 6; i++) {
            this.inner_tiles.push(new Hexagon(0, 0, 0, "desert", -1));
        }

        this.center_tile = new Hexagon(0, 0, 0, "desert", -1);
    }

    private resize_canvas(width: number, height: number): void {
        this.canvas_ref.nativeElement.width = width;
        this.canvas_ref.nativeElement.height = height;
        this.height = height;
        this.width = width;

        this.draw_board();
    }


    on_active_btn_click(btn: "resource" | "dice" | "settle"): void {
        if (this.active_btn() === btn) {
            this.active_btn.set(null);
        } else {
            this.active_btn.set(btn);
        }
    }


    on_resource_btn_click(btn: "wood" | "brick" | "wheat" | "sheep" | "ore" | "desert"): void {
        if (this.resource_btn() === btn) {
            this.resource_btn.set(null);
        } else {
            this.resource_btn.set(btn);
        }
    }


    on_dice_btn_click(btn: "wrap-around" | "manual_select"): void {
        if (this.dice_btn() === btn) {
            this.dice_btn.set(null)
        } else {
            this.dice_btn.set(btn);
        }
    }


    on_canvas_click(event: MouseEvent): void {
        if (this.active_btn() === 'resource' && this.resource_btn() != null) this.select_tile(event);
        if (this.active_btn() === "dice" && this.dice_btn() === 'wrap-around') this.select_dice_wraparound(event);
        if (this.active_btn() === "dice" && this.dice_btn() === 'manual_select') this.open_popup(event);
    }


    assign_number(num: number): void {
        const tile = this.selected_tile_for_num();
        if (tile) {
            tile.num = num;
            tile.draw_hexagon(this.ctx);
        }
        this.close_popup();
    }


    open_popup(event: MouseEvent): void {
        let selected_hex = this.get_tile_from_coords(event);
        if (selected_hex === null) return;
        this.show_number_popup.set(true);
        this.selected_tile_for_num.set(selected_hex);
    }


    close_popup(): void {
        this.show_number_popup.set(false);
        this.selected_tile_for_num.set(null);
    }


    select_dice_wraparound(event: MouseEvent): void {
        const wrap_nums = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];
        let nums_idx = 0;

        const coords = this.get_canvas_coords(event);
        const min_radius = this.center_tile.radius * (Math.sqrt(3) / 2);
        let starting_idx = -1;
        for (let i = 0; i < this.outer_tiles.length; i++) {
            const tile = this.outer_tiles[i];
            if (this.get_distance(coords['x'], coords['y'], tile.center_x, tile.center_y) <= min_radius) {
                starting_idx = i;
                break;
            }
        }

        if (starting_idx == -1) return;
        for (let i = starting_idx; i < this.outer_tiles.length + starting_idx; i++) {
            const idx = i % this.outer_tiles.length;
            const tile = this.outer_tiles[idx];
            if (tile.type === "desert") continue;

            tile.num = wrap_nums[nums_idx];
            nums_idx += 1;
        }

        const inner_start = Math.ceil(starting_idx / 2) % this.inner_tiles.length;
        for (let i = inner_start; i < this.inner_tiles.length + inner_start; i++) {
            const idx = i % this.inner_tiles.length;
            const tile = this.inner_tiles[idx];
            if (tile.type === "desert") continue;

            tile.num = wrap_nums[nums_idx];
            nums_idx += 1;
        }

        this.dice_btn.set(null);
        if (this.center_tile.type === "desert") {
            this.draw_board();
            return;
        }
        this.center_tile.num = wrap_nums[nums_idx];
        this.draw_board();
    }


    select_tile(event: MouseEvent): void {
        let selected_hex = this.get_tile_from_coords(event);
        console.log("at least we are clicking");
        if (selected_hex === null) return;
        console.log("we have a selected hex");
        selected_hex.type = this.resource_btn()!;
        selected_hex.draw_hexagon(this.ctx);
    }


    get_tile_from_coords(event: MouseEvent): Hexagon | null {
        const coords = this.get_canvas_coords(event);
        const tiles = [...this.outer_tiles, ...this.inner_tiles, this.center_tile];

        let selected_hex: Hexagon | null = null;
        const min_radius = this.center_tile.radius * (Math.sqrt(3) / 2);
        for (const tile of tiles) {
            if (this.get_distance(coords['x'], coords['y'], tile.center_x, tile.center_y) <= min_radius) {
                selected_hex = tile;
                break;
            }
        }

        return selected_hex;
    }


    get_canvas_coords(event: MouseEvent): { x: number, y: number } {
        const canvas = this.canvas_ref.nativeElement;
        const rect = canvas.getBoundingClientRect();

        const scale_x = canvas.width / rect.width;
        const scale_y = canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scale_x,
            y: (event.clientY - rect.top) * scale_y
        };
    }


    get_distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2));
    }


    draw_board(): void {
        let center_x: number = this.width / 2.5;
        let center_y: number = this.height / 1.9;
        let radius: number = Math.min(this.width, this.height) / 10;

        // Angle 0 starts at same place, but goes clockwise instead of counter clockwise
        // outer ring is 3 radii from center when angle % 60 != 0 
        // Otherwise, it's 4 * (radi / 2) * sqrt(3) = 2 * radi * sqrt(3)
        // next ring is same thing but only the 60 degree increments
        let outer_starting_angle: number = 0; // in degrees
        let dist_30: number = 3 * radius;
        let dist_60: number = 2 * radius * Math.sqrt(3);
        for (let i = 0; i < this.outer_tiles.length; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);

            this.outer_tiles[i].center_x = outer_starting_angle % 60 == 0 ? center_x + dist_60 * Math.cos(radians) : center_x + dist_30 * Math.cos(radians);
            this.outer_tiles[i].center_y = outer_starting_angle % 60 == 0 ? center_y + dist_60 * Math.sin(radians) : center_y + dist_30 * Math.sin(radians);
            this.outer_tiles[i].radius = radius;
            // this.outer_tiles[i].type = i == 0 ? "wood" : "ore";
            // this.outer_tiles[i].num = 0;

            this.outer_tiles[i].draw_hexagon(this.ctx);
            outer_starting_angle -= 30;
            outer_starting_angle = outer_starting_angle % 360;
        }


        outer_starting_angle = 0;
        dist_60 = dist_60 / 2;
        for (let i = 0; i < this.inner_tiles.length; i++) {
            let radians: number = outer_starting_angle * (Math.PI / 180);
            this.inner_tiles[i].center_x = center_x + dist_60 * Math.cos(radians);
            this.inner_tiles[i].center_y = center_y + dist_60 * Math.sin(radians);
            this.inner_tiles[i].radius = radius;
            // this.inner_tiles[i].type = i == 0 ? "brick" : "wheat";
            // this.inner_tiles[i].num = -1;

            this.inner_tiles[i].draw_hexagon(this.ctx);
            outer_starting_angle -= 60;
            outer_starting_angle = outer_starting_angle % 360;
        }

        this.center_tile.center_x = center_x;
        this.center_tile.center_y = center_y;
        this.center_tile.radius = radius;
        // this.center_tile.type = "sheep";
        // this.center_tile.num = 6;
        this.center_tile.draw_hexagon(this.ctx);
    }


    ngOnDestroy(): void {
        if (this.resize_observer) {
            this.resize_observer.disconnect();
        }
    }
}


class Player {
    settlements: settlement[];
    resources_gained: player_track;
    resources_lost: player_track;

    constructor() {
        this.settlements = [];
        this.resources_gained = { "wood": 0, "brick": 0, "wheat": 0, "sheep": 0, "ore": 0 };
        this.resources_lost = { "wood": 0, "brick": 0, "wheat": 0, "sheep": 0, "ore": 0 };
    }


    add_settlement(center_x: number, center_y: number, tile1: Hexagon, tile2: Hexagon, tile3: Hexagon): void {
        this.settlements.push({ center_x: center_x, center_y: center_y, tile1: tile1, tile2: tile2, tile3: tile3, is_city: false });
        // possibly draw settlement here?
    }


    // Have to figure out who's settlement it is when citying
    // Also have to set a radius for the click radius
    is_my_settlement(center_x: number, center_y: number): boolean {
        return false;
    }


    // I think we find out the settlement by coordinate, not by reference
    city_up(center_x: number, center_y: number): void { }


    roll_dice(num: number): void {
        const update_vals = (i: number, tile: "tile1" | "tile2" | "tile3", roll: number): void => {
            if (this.settlements[i][tile].type === "desert") return;
            if (this.settlements[i][tile].num != roll) return;

            if (!this.settlements[i][tile].is_robbed) {
                this.resources_gained[this.settlements[i][tile].type as keyof player_track] += 1 + Number(this.settlements[i]["is_city"]);

            } else {
                this.resources_lost[this.settlements[i][tile].type as keyof player_track] += 1 + Number(this.settlements[i]["is_city"]);
            }
        };


        for (let i = 0; i < this.settlements.length; i++) {
            update_vals(i, "tile1", num);
            update_vals(i, "tile2", num);
            update_vals(i, "tile3", num);
        }
    }
}


class Hexagon {
    center_x: number;
    center_y: number;
    radius: number; // also side length
    type: string; // desert, wood, brick, wheat, sheep, ore
    num: number; // die number
    is_robbed: boolean;


    constructor(center_x: number, center_y: number, radius: number, type: string, num: number) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius = radius;
        this.type = type;
        this.num = num;
        this.is_robbed = false;
    }


    draw_hexagon(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.radius / 25;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(this.center_x, this.center_y - this.radius);

        let angle: number = 30; // In degrees
        let prev_x: number = this.center_x;
        let prev_y: number = this.center_y - this.radius;
        for (let i = 0; i < 6; i++) {
            const radians: number = angle * (Math.PI / 180);
            const next_x: number = prev_x + this.radius * Math.cos(radians);
            const next_y: number = prev_y + this.radius * Math.sin(radians);

            ctx.lineTo(next_x, next_y);
            prev_x = next_x;
            prev_y = next_y;
            angle += 60;
        }

        let color: string = "";
        switch (this.type) {
            case "wood":
                color = "#8c560f";
                break;
            case "brick":
                color = "#ce866d";
                break;
            case "wheat":
                color = "#e8b339";
                break;
            case "sheep":
                color = "#9fe21b";
                break;
            case "ore":
                color = "#a2c9bc";
                break;
            default:
                color = "#dabf6c";
        }

        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();


        // draw number
        if (this.type != 'desert') {
            ctx.beginPath();
            ctx.moveTo(this.center_x, this.center_y);
            ctx.arc(this.center_x, this.center_y, this.radius / 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#dabf6c';
            ctx.fill();
            ctx.closePath();


            ctx.fillStyle = this.num == 6 || this.num == 8 ? 'red' : 'black';
            ctx.font = `bold ${this.radius / 4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.num}`, this.center_x, this.center_y);
        }
    }

}

